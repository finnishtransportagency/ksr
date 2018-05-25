package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;
import fi.sitowise.ksr.exceptions.KsrApiException;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.servlet.ServletOutputStream;
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

@Service
public class HttpRequestService {
    private CloseableHttpClient closeableHttpClient;
    private RequestConfig requestConfig;

    @Value("${proxy.maxDefaultPerRoute}")
    private int maxDefaultPerRoute;

    @Value("${proxy.maxTotal}")
    private int maxTotal;

    @Value("${proxy.socketTimeout}")
    private int socketTimeout;

    @Value("${ksr.hostname}")
    private String hostName;

    @Autowired
    public void setClient() {
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        cm.setDefaultMaxPerRoute(maxDefaultPerRoute);
        cm.setMaxTotal(maxTotal);
        this.closeableHttpClient = HttpClients.custom().setConnectionManager(cm).build();
    }

    @Autowired
    public void setRequestConfig() {
        RequestConfig.Builder requestConfigBuilder = RequestConfig.custom();
        requestConfigBuilder.setSocketTimeout(socketTimeout);
        this.requestConfig = requestConfigBuilder.build();
    }

    public void fetchToResponse(MapLayer mapLayer, String baseUrl, String method, String endPointUrl, HttpServletResponse response) {
        HttpRequestBase base = getRequestBase(method, endPointUrl, requestConfig);

        try {
            CloseableHttpResponse cRes = closeableHttpClient.execute(base);

            response.setStatus(cRes.getStatusLine().getStatusCode());
            setResponseHeaders(response, cRes);

            if (isGetCapabilitiesRequest(endPointUrl)) {
                setGetCapabilitiesResponse(mapLayer, baseUrl, response, cRes);
            } else {
                setResponseContent(response, cRes);
            }
            cRes.close();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    public boolean isGetCapabilitiesRequest(String endPointUrl) {
        String lowerCasedUrl = endPointUrl.toLowerCase();
        return lowerCasedUrl.contains("wmtscapabilities.xml") || lowerCasedUrl.contains("getcapabilities");
    }

    public HttpRequestBase getRequestBase(String method, String endPointUrl, RequestConfig requestConfig) {
        HttpRequestBase base;
        switch (method) {
            case "GET":
                base = new HttpGet(endPointUrl);
                break;
            default:
                base = new HttpGet(endPointUrl);
        }
        base.setConfig(requestConfig);
        return base;
    }

    public void setResponseHeaders(HttpServletResponse response, CloseableHttpResponse cRes) {
        String[] headerNames = { "Content-Type", "Content-Length", "Cache-control", "Expires", "Last-Modified" };
        for (String headerName : headerNames) {
            Header header = cRes.getFirstHeader(headerName);
            if (header != null) {
                response.setHeader(header.getName(), header.getValue());
            }
        }
    }

    public void setResponseContent(HttpServletResponse response, CloseableHttpResponse cRes) throws IOException {
        HttpEntity entity = cRes.getEntity();
        ServletOutputStream out = response.getOutputStream();
        if (out != null && entity != null) {
            entity.writeTo(out);
        }
    }

    public Document replaceAttributeValues(Document doc, String xPathExpr, String attributeName, String replaceValue, String replaceWith) throws XPathExpressionException {
        XPath xpath = XPathFactory.newInstance().newXPath();

        NodeList nodes = (NodeList) xpath.evaluate(xPathExpr, doc, XPathConstants.NODESET);
        for (int i = 0; i < nodes.getLength(); i++) {
            Node attr = nodes.item(i).getAttributes().getNamedItem(attributeName);
            if (attr != null) {
                String val = attr.getNodeValue();
                attr.setNodeValue(val.replaceFirst(replaceValue, replaceWith));
            }
        }
        return doc;
    }

    public byte[] documentToBytesArray(Document doc) throws TransformerException {
        Transformer transformer = TransformerFactory.newInstance().newTransformer();

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        transformer.transform(new DOMSource(doc), new StreamResult(bos));

        return  bos.toByteArray();
    }


    public void setGetCapabilitiesResponse(MapLayer mapLayer, String baseUrl, HttpServletResponse response, CloseableHttpResponse cRes) {
        HttpEntity entity = cRes.getEntity();

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputStream in = entity.getContent();
            Document doc = builder.parse(in);
            in.close();

            String hostNameWithoutSlash = (hostName.endsWith("/") ? hostName.substring(0, hostName.length() - 1) : hostName);
            String baseUrlWithSlash = hostNameWithoutSlash + baseUrl + (baseUrl.endsWith("/") ? "" : "/" );
            String baseUrlWithoutSlash = hostNameWithoutSlash + (baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl );

            String mlUrl = mapLayer.getUrl();
            String mlUrlWithoutSlash = (mlUrl.endsWith("/") ? mlUrl.substring(0, mlUrl.length() - 1) : mlUrl );

            doc = replaceAttributeValues(doc, "//*[@template]", "template", mlUrl, baseUrlWithSlash);
            doc = replaceAttributeValues(doc, "//*[name()='ows:Get']", "xlink:href", mlUrlWithoutSlash, baseUrlWithoutSlash);
            doc = replaceAttributeValues(doc, "//*[name()='OnlineResource']", "xlink:href", mlUrlWithoutSlash, baseUrlWithoutSlash);

            byte[] xmlBytes = documentToBytesArray(doc);

            response.setHeader("Content-Length", String.format("%d", xmlBytes.length));

            ServletOutputStream out = response.getOutputStream();
            out.write(xmlBytes);


        } catch (SAXException | IOException | ParserConfigurationException |
                XPathExpressionException | TransformerException e ) {
            throw new KsrApiException.InternalServerErrorException("Error handling reponse from remote-service.", e);
        }
    }
}
