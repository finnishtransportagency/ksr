package fi.sitowise.ksr.service;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
     */
    public void fetchToResponse(String layerUrl, String authentication, String baseUrl,
            String endPointUrl, HttpServletRequest request, HttpServletResponse response, boolean useProxy) {
        try {
            URI endpointURI = new URI(endPointUrl);
            String path = endpointURI.getRawPath();
            String query = endpointURI.getRawQuery();
            HttpHost target = URIUtils.extractHost(endpointURI);

            HttpRequestBase base = getRequestBase(
                    request,
                    authentication,
                    KsrStringUtils.replaceMultipleSlashes(String.format("%s/?%s", path, query)));
            if (useProxy) {
                base.setConfig(proxyRequestConfig);
            } else {
                base.setConfig(nonProxyRequestConfig);
            }
            CloseableHttpResponse cRes = closeableHttpClient.execute(target, base);

            response.setStatus(cRes.getStatusLine().getStatusCode());
            setResponseHeaders(response, cRes);

            if (isGetCapabilitiesRequest(endPointUrl)) {
                setGetCapabilitiesResponse(layerUrl, baseUrl, response, cRes, endPointUrl);
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
     * Returns a correct HttpRequestBase for given method, endpoint and config.
     *
     * @param request interface for getting request method and POST request parameters.
     * @param endPointUrl The url to be fetched.
     * @return Correct HttpRequestBase or GET if no matches found for method.
     * @throws UnsupportedEncodingException if adding POST parameters fails.
     */
    public HttpRequestBase getRequestBase(HttpServletRequest request, String authentication,
            String endPointUrl) throws UnsupportedEncodingException {
        HttpRequestBase base;
        switch (request.getMethod()) {
            case "GET":
                base = new HttpGet(endPointUrl);
                break;
            case "POST":
                base = new HttpPost(endPointUrl);
                if (!CollectionUtils.isEmpty(request.getParameterMap())) {
                    List<NameValuePair> params = new ArrayList<>();
                    for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
                        for (String value : entry.getValue()) {
                            params.add(new BasicNameValuePair(entry.getKey(), value));
                        }
                    }
                    ((HttpPost) base).setEntity(new UrlEncodedFormEntity(params));
                }
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
}
