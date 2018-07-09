package fi.sitowise.ksr.service;

import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicHeader;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPathExpressionException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;

@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = HttpRequestService.class)
public class HttpRequestServiceTests {

    @Autowired
    HttpRequestService httpRequestService;

    @MockBean
    CloseableHttpClient closeableHttpClient;

    @MockBean
    RequestConfig requestConfig;

    @Test
    public void testIsGetCapabilitiesRequest() {
        Assert.assertEquals(true, httpRequestService.isGetCapabilitiesRequest("http://test.example.com/wms?service=wms&request=GetCapabilities"));
        Assert.assertEquals(true, httpRequestService.isGetCapabilitiesRequest("http://test.example.com/wms?service=wms&request=getcapabilities"));
        Assert.assertEquals(true, httpRequestService.isGetCapabilitiesRequest("http://test.example.com/wmts/1.0.0/WMTSCapabilities.xml"));
        Assert.assertEquals(false, httpRequestService.isGetCapabilitiesRequest("http://test.example.com/wms?service=wms&request=GetMap"));
    }

    @Test
    public void testGetRequestBase() throws URISyntaxException, UnsupportedEncodingException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");

        HttpRequestBase getBase = httpRequestService.getRequestBase(request, null, "http://test.example.com/wms?service=wms&request=GetCapabilities", null);
        Assert.assertEquals("GET", getBase.getMethod());
        Assert.assertNull(getBase.getFirstHeader("Authorization"));
        Assert.assertEquals(new java.net.URI("http://test.example.com/wms?service=wms&request=GetCapabilities"), getBase.getURI());

        HttpRequestBase getAuthBase = httpRequestService.getRequestBase(request, "user:pass", "http://test.2.example.com/wms?service=wms&request=GetCapabilities", null);
        Assert.assertEquals("GET", getAuthBase.getMethod());
        Assert.assertEquals("Basic user:pass", getAuthBase.getFirstHeader("Authorization").getValue());
        Assert.assertEquals(new java.net.URI("http://test.2.example.com/wms?service=wms&request=GetCapabilities"), getAuthBase.getURI());
    }

    @Test
    public void testPostRequestBase() throws URISyntaxException, UnsupportedEncodingException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("POST");
        request.setParameter("test", "test");

        HttpRequestBase postAuthBase = httpRequestService.getRequestBase(request, "user:pass",
                "http://test.example.com/query", null);
        Assert.assertEquals("POST", postAuthBase.getMethod());
        Assert.assertEquals("Basic user:pass", postAuthBase.getFirstHeader("Authorization").getValue());
        Assert.assertEquals(new java.net.URI("http://test.example.com/query"), postAuthBase.getURI());
        Assert.assertTrue(((HttpPost) postAuthBase).getEntity() instanceof UrlEncodedFormEntity);
    }

    @Test
    public void testSetResponseHeaders() {
        MockHttpServletResponse res = new MockHttpServletResponse();
        CloseableHttpResponse cRes = Mockito.mock(CloseableHttpResponse.class);
        Mockito.when(cRes.getFirstHeader("Content-Type")).thenReturn(new BasicHeader("Content-Type", "image/png"));
        Mockito.when(cRes.getFirstHeader("Expires")).thenReturn(new BasicHeader("Expires", "Wed, 21 Oct 2045 07:28:00 GMT"));
        Mockito.when(cRes.getFirstHeader("Content-Length")).thenReturn(null);
        Mockito.when(cRes.getFirstHeader("Cache-control")).thenReturn(null);
        Mockito.when(cRes.getFirstHeader("Last-Modified")).thenReturn(null);

        httpRequestService.setResponseHeaders(res, cRes);

        Assert.assertEquals("image/png", res.getHeader("Content-Type"));
        Assert.assertEquals("Expires", "Wed, 21 Oct 2045 07:28:00 GMT", res.getHeader("Expires"));
        Assert.assertNull(res.getHeader("Last-Modified"));
        Assert.assertNull(res.getHeader("Content-Length"));
        Assert.assertNull(res.getHeader("Last-Modified"));
    }

    @Test
    public void testReplaceAttributeValuesWithoutNull() throws IOException, SAXException, ParserConfigurationException, XPathExpressionException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();

        String xml = "<a><b><c name=\"replace_this\">C</c></b></a>";
        Document doc = builder.parse(new ByteArrayInputStream(xml.getBytes()));

        doc = httpRequestService.replaceAttributeValues(doc, "//*[name()='c']", "name", "replace_this", "is_replaced");

        NodeList elements = doc.getElementsByTagName("c");
        NamedNodeMap attributes = elements.item(0).getAttributes();
        Node attribute = attributes.getNamedItem("name");

        Assert.assertEquals("is_replaced", attribute.getNodeValue());
    }

    @Test
    public void testReplaceAttributeValuesWithNull() throws IOException, SAXException, ParserConfigurationException, XPathExpressionException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();

        String xml = "<a><b><c name=\"replace_this\">C</c></b></a>";
        Document doc = builder.parse(new ByteArrayInputStream(xml.getBytes()));

        doc = httpRequestService.replaceAttributeValues(doc, "//*[name()='c']", "name", "replace_this", null);

        NodeList elements = doc.getElementsByTagName("c");
        NamedNodeMap attributes = elements.item(0).getAttributes();
        Node attribute = attributes.getNamedItem("name");

        Assert.assertEquals("replace_this", attribute.getNodeValue());
    }

    @Test
    public void testDocumentToBytesArray() throws IOException, SAXException, ParserConfigurationException, TransformerException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();

        String xml = "<a><b>C</b></a>";
        Document doc = builder.parse(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertEquals(
                "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><a><b>C</b></a>",
                new String(httpRequestService.documentToBytesArray(doc)));
    }

    @Test
    public void testParseDocumentFromEntity() throws IOException, ParserConfigurationException, SAXException {
        InputStream in = new ByteArrayInputStream("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><a><b>C</b></a>".getBytes());
        HttpEntity entity = Mockito.mock(HttpEntity.class);
        Mockito.when(entity.getContent()).thenReturn(in);

        Document doc = httpRequestService.parseDocumentFromEntity(entity);

        Assert.assertEquals("1.0", doc.getXmlVersion());
    }

    @Test
    public void testSetGetCapabilitiesResponse() throws IOException {
        MockHttpServletResponse res = new MockHttpServletResponse();
        byte[] testBytes = "test".getBytes();

        httpRequestService.writeBytesArrayToResponse(testBytes, res);

        Assert.assertEquals(testBytes.length, Integer.parseInt(res.getHeader("Content-Length")));
    }
}
