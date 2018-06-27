package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.jooq.tables.records.LayerRecord;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import fi.sitowise.ksr.service.LayerService;
import fi.sitowise.ksr.service.ProxyService;
import fi.sitowise.ksr.domain.Layer;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpServletResponse;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Proxy controller tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {ProxyController.class})
@ComponentScan(basePackages =
        {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config", "fi.sitowise.ksr.controller", "fi.sitowise.ksr.service"})
public class ProxyControllerTests {

    @Autowired
    private WebApplicationContext context;

    /**
     * The Proxy controller.
     */
    @Autowired
    ProxyController proxyController;

    /**
     * The Mock mvc.
     */
    @Autowired
    MockMvc mockMvc;

    /**
     * The Layer service.
     */
    @MockBean
    LayerService layerService;

    /**
     * The Proxy service.
     */
    @MockBean
    ProxyService proxyService;

    /**
     * The Layer group repository.
     */
    @MockBean
    LayerGroupRepository layerGroupRepository;

    /**
     * Sets webAppContext and adds springSecurity.
     */
    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity()).build();
    }

    /**
     * Test general proxy.
     *
     * @throws Exception the exception
     */
    @Test
    public void testGeneralProxy() throws Exception {
        Mockito.doNothing().when(proxyService).get(
                Mockito.any(Layer.class),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.any(HttpServletResponse.class));


        LayerRecord lr = new LayerRecord();
        lr.setUrl("http://test.example.com");

        Layer l = new Layer();
        l.setUrl("http://test.example.com/arcgis/services/WMS/MapServer/WMSServer?");

        Mockito.when(layerService.getLayer(Mockito.anyInt(), Mockito.anyBoolean())).thenReturn(l);

        mockMvc.perform(get("/api/proxy/layer/134/1.00/GetCapalibites.xml").header("OAM_REMOTE_USER", "TestUser")
                .header("OAM_USER_FIRST_NAME", "firstName")
                .header("OAM_USER_LAST_NAME", "lastName")
                .header("OAM_USER_MAIL", "test@test.com")
                .header("OAM_USER_MOBILE", "+123456789")
                .header("OAM_ORGANIZATION", "sitowise")
                .header("OAM_GROUPS", "KSR_ROLE_USER,KSR_ROLE_ADMIN")).andExpect(status().isOk());
        mockMvc.perform(get("/api/proxy").header("OAM_REMOTE_USER", "TestUser")
                .header("OAM_USER_FIRST_NAME", "firstName")
                .header("OAM_USER_LAST_NAME", "lastName")
                .header("OAM_USER_MAIL", "test@test.com")
                .header("OAM_USER_MOBILE", "+123456789")
                .header("OAM_ORGANIZATION", "sitowise")
                .header("OAM_GROUPS", "KSR_ROLE_USER,KSR_ROLE_ADMIN")).andExpect(status().isNotFound());
    }

    /**
     * Test get service endpoint.
     */
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
