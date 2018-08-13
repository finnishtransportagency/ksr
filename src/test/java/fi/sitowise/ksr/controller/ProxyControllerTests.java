package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.jooq.tables.records.LayerRecord;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import fi.sitowise.ksr.service.LayerService;
import fi.sitowise.ksr.service.ProxyService;
import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpServletRequest;
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

    @Value("${server.servlet.context-path}")
    String contextPath;

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
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));


        LayerRecord lr = new LayerRecord();
        lr.setUrl("http://test.example.com");

        Layer l = new Layer();
        l.setUrl("http://test.example.com/arcgis/services/WMS/MapServer/WMSServer?");

        Mockito.when(layerService.getLayer(Mockito.anyInt(), Mockito.anyBoolean(), Mockito.any(LayerAction.class))).thenReturn(l);

        mockMvc.perform(get("/api/proxy/layer/134/1.00/GetCapalibites.xml").header("OAM_REMOTE_USER", "TestUser")
                .header("OAM_USER_FIRST_NAME", "firstName")
                .header("OAM_USER_LAST_NAME", "lastName")
                .header("OAM_USER_MAIL", "test@test.com")
                .header("OAM_USER_MOBILE", "+123456789")
                .header("OAM_ORGANIZATION", "sitowise")
                .header("OAM_GROUPS", "KSR_ROLE_USER")).andExpect(status().isOk());
        mockMvc.perform(get("/api/proxy").header("OAM_REMOTE_USER", "TestUser")
                .header("OAM_USER_FIRST_NAME", "firstName")
                .header("OAM_USER_LAST_NAME", "lastName")
                .header("OAM_USER_MAIL", "test@test.com")
                .header("OAM_USER_MOBILE", "+123456789")
                .header("OAM_ORGANIZATION", "sitowise")
                .header("OAM_GROUPS", "KSR_ROLE_USER")).andExpect(status().isNotFound());
    }

    /**
     * Test get service endpoint.
     */
    @Test
    public void testGetServiceEndpoint() {
        Assert.assertNull(proxyController.getServiceEndpoint(null));
        String requestUri = KsrStringUtils.replaceMultipleSlashes(contextPath + "/api/proxy/layer/134/1.00/GetCapalibites.xml");
        Assert.assertEquals(
                "1.00/GetCapalibites.xml",
                proxyController.getServiceEndpoint(requestUri));

        String requestUri2 = KsrStringUtils.replaceMultipleSlashes(contextPath + "/api/proxy/layer/134/a/b/c/D?e=f&g=h");
        Assert.assertEquals(
                "a/b/c/D?e=f&g=h",
                proxyController.getServiceEndpoint(requestUri2));

        String requestUri3 = KsrStringUtils.replaceMultipleSlashes(contextPath + "/api/proxy/layer/321/");
        Assert.assertEquals("", proxyController.getServiceEndpoint(requestUri3));

        String requestUri4 = KsrStringUtils.replaceMultipleSlashes(contextPath + "/api/proxy/layer/321");
        Assert.assertNull(proxyController.getServiceEndpoint(requestUri4));
    }
}
