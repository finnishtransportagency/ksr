package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.MapLayer;
import fi.sitowise.ksr.service.MapLayerService;
import fi.sitowise.ksr.service.ProxyService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.servlet.http.HttpServletResponse;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {ProxyController.class} )
@ComponentScan(basePackages =
        { "fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config", "fi.sitowise.ksr.controller", "fi.sitowise.ksr.service" })
public class ProxyControllerTests {

    @Autowired
    ProxyController proxyController;

    @Autowired
    MockMvc mockMvc;

    @MockBean
    ProxyService proxyService;

    @MockBean
    MapLayerService mapLayerService;

    @Test
    public void testGeneralProxy() throws Exception {
        Mockito.doNothing().when(proxyService).get(
                Mockito.any(MapLayer.class),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.any(HttpServletResponse.class));

        MapLayer ml = new MapLayer();
        ml.setId(123);
        ml.setUrl("http://test.example.com");
        Mockito.when(mapLayerService.getMapLayerById(Mockito.anyInt())).thenReturn(ml);

        mockMvc.perform(get("/api/proxy/layer/134/1.00/GetCapalibites.xml")).andExpect(status().isOk());
        mockMvc.perform(get("/api/proxy")).andExpect(status().isNotFound());
    }

    @Test
    public void testGetServiceEndpoint() {
        Assert.assertNull(proxyController.getServiceEndpoint(null));
        Assert.assertEquals(
                "1.00/GetCapalibites.xml",
                proxyController.getServiceEndpoint("/api/proxy/layer/134/1.00/GetCapalibites.xml"));
        Assert.assertEquals(
                "a/b/c/D?e=f&g=h",
                proxyController.getServiceEndpoint("/api/proxy/layer/321/a/b/c/D?e=f&g=h"));
        Assert.assertEquals("", proxyController.getServiceEndpoint("/api/proxy/layer/321/"));
        Assert.assertNull(proxyController.getServiceEndpoint("/api/proxy/layer/321"));
    }
}
