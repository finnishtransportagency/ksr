package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = ProxyService.class)
public class ProxyServiceTests {

    @Autowired
    private ProxyService proxyService;

    @MockBean
    private HttpRequestService httpRequestService;

    @Test
    public void testGetEndpointUrlForWMSWithoutTrailingSlash() {
        MapLayer ml = new MapLayer();
        ml.setUrl("http://test.example.com/wms");
        ml.setId(123);
        ml.setType("WMS");

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "workspace", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "workspace/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );
    }

    @Test
    public void testGetEndpointUrlForWMSWithTrailingSlash() {
        MapLayer ml = new MapLayer();
        ml.setUrl("http://test.example.com/wms/");
        ml.setId(123);
        ml.setType("WMS");

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "workspace", "request=GetCapabilities&service=WMS&version=1.1.0")
        );

        Assert.assertEquals(
                "http://test.example.com/wms/workspace?request=GetCapabilities&service=WMS&version=1.1.0",
                proxyService.getEndpointUrl(ml, "workspace/", "request=GetCapabilities&service=WMS&version=1.1.0")
        );
    }

    @Test
    public void testGetEndpointUrlForWMTSGetCapabilitiesWithTrailingSlash() {
        MapLayer ml = new MapLayer();
        ml.setUrl("http://test.example.com/wmts/");
        ml.setId(123);
        ml.setType("WMTS");

        Assert.assertEquals("http://test.example.com/wmts/1.0.0/WMTSCapabilities.xml",
                proxyService.getEndpointUrl(ml, "1.0.0/WMTSCapabilities.xml", null));
    }

    @Test
    public void testGetEndpointUrlForWMTSGetCapabilitiesWithoutTrailingSlash() {
        MapLayer ml = new MapLayer();
        ml.setUrl("http://test.example.com/wmts");
        ml.setId(123);
        ml.setType("WMTS");

        Assert.assertEquals("http://test.example.com/wmts/1.0.0/WMTSCapabilities.xml",
                proxyService.getEndpointUrl(ml, "1.0.0/WMTSCapabilities.xml", null));
    }
}
