package fi.sitowise.ksr.service;

import fi.sitowise.ksr.controller.PrintOutputController;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.annotation.PostConstruct;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * A Service to handle HTTP(S) requests to external servers.
 * This service uses a pool of HTTP-connection to avoid extra
 * overhead of initializing HTTP-connections.
 */
@Service
public class HttpRequestService {
    private CloseableHttpClient closeableHttpClient;
    private RequestConfig nonProxyRequestConfig;
    private RequestConfig proxyRequestConfig;

    @Value("${proxy.maxDefaultPerRoute}")
    private int maxDefaultPerRoute;

    @Value("${proxy.maxTotal}")
    private int maxTotal;

    @Value("${proxy.socketTimeout}")
    private int socketTimeout;

    @Value("${print.service.url}")
    private String printServiceUrl;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Value("${http.proxyHost:#{null}}")
    private String proxyHost;

    @Value("${http.proxyPort:#{null}}")
    private Integer proxyPort;

    @PostConstruct
    public void setClient() {
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        cm.setDefaultMaxPerRoute(maxDefaultPerRoute);
        cm.setMaxTotal(maxTotal);
        this.closeableHttpClient = HttpClients.custom().setConnectionManager(cm).build();
    }

    @PostConstruct
    public void setNonProxyRequestConfig() {
        this.nonProxyRequestConfig = getRequestConfigBase().build();
    }

    @PostConstruct
    public void setProxyRequestConfig() {
        RequestConfig.Builder configBase = getRequestConfigBase();
        if (proxyHost != null && proxyPort != null) {
            HttpHost proxy = new HttpHost(proxyHost, proxyPort);
            configBase.setProxy(proxy);
        }
        this.proxyRequestConfig = configBase.build();
    }

    public RequestConfig.Builder getRequestConfigBase() {
        RequestConfig.Builder requestConfigBuilder = RequestConfig.custom();
        requestConfigBuilder.setSocketTimeout(socketTimeout);
        return requestConfigBuilder;
    }

    /**
     * Fetch endPointUrl:s content and write into HttpServletResponse.
     *
     * @param layerUrl Layer URL that is requested.
     * @param baseUrl Baseurl for proxy-service for given layer.
     * @param endPointUrl The url to be fetched.
     * @param request HTTP request interface.
     * @param response HttpServletResponse, where to write the fetched content
     * @param editedParams List, which contains edited Web_Map_as_JSON for printing
     */
    public void fetchToResponse(String layerUrl, String authentication, String baseUrl,
            String endPointUrl, HttpServletRequest request, HttpServletResponse response, boolean useProxy, List<NameValuePair> editedParams) {
        try {
            URI endpointURI = new URI(endPointUrl);
            String path = endpointURI.getRawPath();
            String query = endpointURI.getRawQuery();
            HttpHost target = URIUtils.extractHost(endpointURI);

            HttpRequestBase base = getRequestBase(
                    request,
                    authentication,
                    query == null ? path : KsrStringUtils.replaceMultipleSlashes(String.format("%s/?%s", path, query)),
                    editedParams);
            if (useProxy) {
                base.setConfig(proxyRequestConfig);
            } else {
                base.setConfig(nonProxyRequestConfig);
            }
            setBaseHeaders(request, base);
            CloseableHttpResponse cRes = closeableHttpClient.execute(target, base);

            response.setStatus(cRes.getStatusLine().getStatusCode());
            setResponseHeaders(response, cRes);

            if (isGetCapabilitiesRequest(endPointUrl)) {
                setGetCapabilitiesResponse(layerUrl, baseUrl, response, cRes, endPointUrl);
            } else if (isPrintOutputRequest(endPointUrl)) {
                setPrintOutputResponse(response, cRes);
            } else {
                setResponseContent(response, cRes);
            }
            cRes.close();

        } catch (Exception e) {
            String msg = String.format("Error handling request. URL: [%s]. Proxy: [%b]", endPointUrl, useProxy);
            throw new KsrApiException.InternalServerErrorException(msg, e);
        }
    }

    /**
     * Sets specified headers from HttpServletRequest to HttpRequestBase
     *
     * @param request HttpServletRequest Request to read headers from
     * @param base HttpRequestBase Target to write headers to
     */
    public void setBaseHeaders(HttpServletRequest request, HttpRequestBase base) {
        String[] headerNames = { "Content-Type" };
        for (String headerName: headerNames) {
            String headerValue = request.getHeader(headerName);
            if (headerValue != null) {
                base.setHeader(headerName, headerValue);
            }
        }
    }

    /**
     * Returns whether given URL should be treated as a GetCapabilities -URL.
     *
     * @param endPointUrl URL that should be inspected.
     * @return boolean whether URL should be treated as a GetCapablities URL.
     */
    public boolean isGetCapabilitiesRequest(String endPointUrl) {
        String lowerCasedUrl = endPointUrl.toLowerCase();
        return lowerCasedUrl.contains("wmtscapabilities.xml") || lowerCasedUrl.contains("getcapabilities");
    }

    /**
     * Returns whether given URL should be treated as a Print Output Request.
     *
     * @param endPointUrl URL that should be inspected.
     * @return boolean whether URL should be treated as a Print Output Request.
     */
    private boolean isPrintOutputRequest(String endPointUrl) {
        return endPointUrl.contains("Export%20Web%20Map%20Task/execute");
    }

    /**
     * Returns a correct HttpRequestBase for given method, endpoint and config.
     *
     * @param request interface for getting request method and POST request parameters.
     * @param authentication authentication
     * @param endPointUrl The url to be fetched.
     * @param editedParams edited parameters / querystring from print request.
     * @return Correct HttpRequestBase or GET if no matches found for method.
     */
    public HttpRequestBase getRequestBase(HttpServletRequest request, String authentication,
            String endPointUrl, List<NameValuePair> editedParams) {
        HttpRequestBase base;
        List<NameValuePair> params = new ArrayList<>();
        switch (request.getMethod()) {
            case "GET":
                base = requestBaseGet(params, editedParams, endPointUrl);
                break;
            case "POST":
                base = requestBasePost(request, params, editedParams, endPointUrl);
                break;
            default:
                base = new HttpGet(endPointUrl);
        }
        if (authentication != null) {
            base.setHeader("Authorization", String.format("Basic %s", authentication));
        }
        return base;
    }

    /**
     * Set HttpServletResponse headers from CloseableHttpResponse.
     * Only specified headers are added if the exists. Other headers are omitted.
     *
     * @param response HttpServletResponse where the headers should be added.
     * @param cRes CloseableHttpResponse from where to read the headers.
     */
    public void setResponseHeaders(HttpServletResponse response, CloseableHttpResponse cRes) {
        String[] headerNames = { "Content-Type", "Content-Length", "Cache-control", "Expires", "Last-Modified" };
        for (String headerName : headerNames) {
            Header header = cRes.getFirstHeader(headerName);
            if (header != null) {
                response.setHeader(header.getName(), header.getValue());
            }
        }
    }

    /**
     * Write content from CloseableHttpResponse into HttpServletResponse
     *
     * @param response HttpServletResponse whose OutputStream to write.
     * @param cRes CloseableHttpResponse from where to read contents.
     * @throws IOException
     */
    public void setResponseContent(HttpServletResponse response, CloseableHttpResponse cRes) throws IOException {
        HttpEntity entity = cRes.getEntity();
        ServletOutputStream out = response.getOutputStream();
        if (out != null && entity != null) {
            entity.writeTo(out);
        }
    }

    /**
     * Replace given attribute values with new ones for matching XML-elements.
     *
     * @param doc XML Document where to replace attributes
     * @param xPathExpr XPath expression to search corresponding nodes.
     * @param attributeName Name of the attribute.
     * @param replaceValue Value/placeholder to be replaced.
     * @param replaceWith The value that will replace the 'replaceValue'
     * @return The XML Document with replaced values;
     * @throws XPathExpressionException
     */
    public Document replaceAttributeValues(Document doc, String xPathExpr, String attributeName, String replaceValue, String replaceWith) throws XPathExpressionException {
        XPath xpath = XPathFactory.newInstance().newXPath();

        NodeList nodes = (NodeList) xpath.evaluate(xPathExpr, doc, XPathConstants.NODESET);
        for (int i = 0; i < nodes.getLength(); i++) {
            Node attr = nodes.item(i).getAttributes().getNamedItem(attributeName);
            if (attr != null) {
                String val = attr.getNodeValue().toLowerCase();
                if (replaceValue != null && replaceWith != null) {
                    attr.setNodeValue(val.replaceFirst(replaceValue.toLowerCase(), replaceWith.toLowerCase()));
                }
            }
        }
        return doc;
    }

    /**
     * Writes a XML Document into a byte[] -array.
     *
     * @param doc XML Document
     * @return byte[] -array of XML Document content.
     * @throws TransformerException
     */
    public byte[] documentToBytesArray(Document doc) throws TransformerException {
        Transformer transformer = TransformerFactory.newInstance().newTransformer();

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        transformer.transform(new DOMSource(doc), new StreamResult(bos));

        return  bos.toByteArray();
    }

    /**
     * Parse XML Docoument from HTTPEntity.
     *
     * @param entity HTTPEntity which holds the contents of XML-document.
     * @return Document XML Document parsed from Entitys content.
     * @throws IOException
     * @throws SAXException
     * @throws ParserConfigurationException
     */
    public Document parseDocumentFromEntity(HttpEntity entity) throws IOException, SAXException, ParserConfigurationException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        InputStream in = entity.getContent();
        Document doc = builder.parse(in);
        in.close();
        return doc;
    }

    /**
     * Write byte[] into HttpServletResponses OutputStream. Also set's the correct Content-Size -header based on the
     * byte[] -arrays length.
     *
     * @param bytes byte[] to be written.
     * @param response HttpServletResponse whose OutputStream the bytes should be written.
     * @throws IOException
     */
    public void writeBytesArrayToResponse(byte[] bytes, HttpServletResponse response) throws IOException {
        response.setHeader("Content-Length", String.format("%d", bytes.length));
        ServletOutputStream out = response.getOutputStream();
        out.write(bytes);
    }

    /**
     * Handle GetCapabilities Response so that it no longer contains links to external services but into our own proxy.
     *
     * @param layerUrl The requested layer URL.
     * @param baseUrl Baseurl for proxy-service for given layer.
     * @param response HttpServletResponse, where to write the fetched content
     * @param cRes CloseableHttpResponse from where to read contents.
     * @param requestUrl Url where the response is from
     */
    public void setGetCapabilitiesResponse(
            String layerUrl,
            String baseUrl,
            HttpServletResponse response,
            CloseableHttpResponse cRes,
            String requestUrl
    ) {
        HttpEntity entity = cRes.getEntity();

        try {
            Document doc = parseDocumentFromEntity(entity);

            String baseUrlWithSlash = KsrStringUtils.addTrailingSlash(baseUrl);
            String baseUrlWithoutSlash = KsrStringUtils.removeTrailingSlash(baseUrl);

            String mlUrlWithoutSlash = KsrStringUtils.removeTrailingSlash(layerUrl);

            doc = replaceAttributeValues(doc, "//*[@template]", "template", layerUrl, baseUrlWithSlash);
            doc = replaceAttributeValues(doc, "//*[name()='ows:Get']", "xlink:href", mlUrlWithoutSlash, baseUrlWithoutSlash);
            doc = replaceAttributeValues(doc, "//*[name()='OnlineResource']", "xlink:href", mlUrlWithoutSlash, baseUrlWithoutSlash);

            byte[] xmlBytes = documentToBytesArray(doc);
            writeBytesArrayToResponse(xmlBytes, response);

        } catch (SAXException | IOException | ParserConfigurationException |
                XPathExpressionException | TransformerException e ) {
            String msg = String.format(
                    "Error handling response from remote-service. URL: [%s]", requestUrl);
            throw new KsrApiException.InternalServerErrorException(msg, e);
        }
    }

    /**
     * Replace print output response body url to proxy url
     *
     * @param response HttpServletResponse, where to write the fetched content
     * @param cRes CloseableHttpResponse from where to read contents.
     */
    @SuppressWarnings("unchecked")
    private void setPrintOutputResponse(HttpServletResponse response, CloseableHttpResponse cRes) {
        try {
            String printOutputUrl = KsrStringUtils.replaceMultipleSlashes(contextPath + PrintOutputController.PRINT_OUTPUT_URL);
            String responseString;
            responseString = EntityUtils.toString(cRes.getEntity(), "UTF-8");
            JSONParser parser = new JSONParser();
            JSONObject responseJson = (JSONObject) parser.parse(responseString);
            JSONArray responseArray = (JSONArray) (responseJson != null ? responseJson.get("results") : null);
            if (responseArray != null) {
                for (Object entry : responseArray) {
                    String value = ((JSONObject) entry).get("value").toString();
                    JSONObject valueJson = (JSONObject) parser.parse(value);
                    String url = valueJson.get("url").toString();
                    valueJson.replace("url", url.replaceAll(url.split("/_ags_")[0], printOutputUrl));
                    ((JSONObject) entry).replace("value", valueJson);
                }
            }
            if (responseJson != null) {
                response.getWriter().write(responseJson.toString());
            }
        } catch (ParseException | IOException e) {
            String msg = "Error creating print output response";
            throw new KsrApiException.InternalServerErrorException(msg, e);
        }
    }

    /**
     * Returns a correct HttpRequestBase from POST request.
     *
     * @param request interface for getting request method and POST request parameters.
     * @param params List<NameValuePair> empty list
     * @param editedParams edited parameters / querystring from print request.
     *
     * @return base
     */
    private HttpRequestBase requestBasePost(HttpServletRequest request, List<NameValuePair> params, List<NameValuePair> editedParams, String endPointUrl) {
        HttpRequestBase base = new HttpPost(endPointUrl);
        if (!CollectionUtils.isEmpty(request.getParameterMap())) {
            if (editedParams != null) {
                for (NameValuePair entry : editedParams) {
                    params.add(new BasicNameValuePair(entry.getName(), entry.getValue()));
                }
            } else {
                for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
                    for (String value : entry.getValue()) {
                        params.add(new BasicNameValuePair(entry.getKey(), value));
                    }
                }
            }
            try {
                ((HttpPost) base).setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                String msg = "Error creating base from POST request";
                throw new KsrApiException.InternalServerErrorException(msg, e);
            }
        }
        return base;
    }

    /**
     * Returns a correct HttpRequestBase from GET request.
     * Print GET request gets changed to HttpPost
     *
     * @param params List<NameValuePair> empty list
     * @param editedParams edited parameters / querystring from print request.
     * @param endPointUrl The url to be fetched.
     *
     * @return base
     */
    private HttpRequestBase requestBaseGet(List<NameValuePair> params, List<NameValuePair> editedParams, String endPointUrl) {
        HttpRequestBase base;
        if (editedParams != null) {
            base = new HttpPost(endPointUrl.split("\\?")[0]);
            for (NameValuePair entry : editedParams) {
                params.add(new BasicNameValuePair(entry.getName(), entry.getValue()));
            }
            try {
                ((HttpPost) base).setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                String msg = "Error creating base from GET request";
                throw new KsrApiException.InternalServerErrorException(msg, e);
            }
        } else {
            base = new HttpGet(endPointUrl);
        }
        return base;
    }
}
