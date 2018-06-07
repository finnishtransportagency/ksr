package fi.sitowise.ksr.service;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Proxy service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = ProxyService.class)
public class ProxyServiceTests {

    @Autowired
    private ProxyService proxyService;

    @MockBean
    private HttpRequestService httpRequestService;

    /**
     * Test get endpoint url for wms without trailing slash.
     */
    @Test
    public void testGetEndpointUrlForWMSWithoutTrailingSlash() {
       String url ="http://test.example.com/wms";

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "workspace", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "workspace/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );
    }

    /**
     * Test get endpoint url for wms with trailing slash.
     */
    @Test
    public void testGetEndpointUrlForWMSWithTrailingSlash() {
        String url ="http://test.example.com/wms/";

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "workspace", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(url, "workspace/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );
    }

    /**
     * Test get endpoint url for wmts get capabilities with trailing slash.
     */
    @Test
    public void testGetEndpointUrlForWMTSGetCapabilitiesWithTrailingSlash() {
        String url ="http://test.example.com/wmts/";

        Assert.assertEquals("http://test.example.com/wmts/1.0.0/WMTSCapabilities.xml",
                proxyService.getEndpointUrl(url, "1.0.0/WMTSCapabilities.xml", null));
    }

    /**
     * Test get endpoint url for wmts get capabilities without trailing slash.
     */
    @Test
    public void testGetEndpointUrlForWMTSGetCapabilitiesWithoutTrailingSlash() {
        String url ="http://test.example.com/wmts";

        Assert.assertEquals("http://test.example.com/wmts/1.0.0/WMTSCapabilities.xml",
                proxyService.getEndpointUrl(url, "1.0.0/WMTSCapabilities.xml", null));
    }
}
