package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.helper.OAMHeaderHelper;
import fi.sitowise.ksr.repository.LayerGroupRepository;
import fi.sitowise.ksr.repository.UserLayerRepository;
import fi.sitowise.ksr.repository.WorkspaceRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
     * Proxy controller.
     */
    @Autowired
    ProxyController proxyController;

    /**
     * Mock mvc.
     */
    @Autowired
    MockMvc mockMvc;

    /**
     * Layer service.
     */
    @MockBean
    LayerService layerService;

    /**
     * Proxy service.
     */
    @MockBean
    ProxyService proxyService;

    /**
     * Layer group repository.
     */
    @MockBean
    LayerGroupRepository layerGroupRepository;

    /**
     * User Layer repository.
     */
    @MockBean
    UserLayerRepository userLayerRepository;

    /**
     * Workspace repository.
     */
    @MockBean
    WorkspaceRepository workspaceRepository;

    /**
     * Sets webAppContext and adds springSecurity.
     */
    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity()).build();

        Mockito.doNothing().when(proxyService).get(
                Mockito.any(Layer.class),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.any(HttpServletRequest.class),
                Mockito.any(HttpServletResponse.class));

        Layer layer1 = new Layer();
        layer1.setId("1");
        layer1.setUrl("https://agfs.example.com/");
        layer1.setType("agfs");

        Layer layer2 = new Layer();
        layer2.setId("2");
        layer2.setUrl("https://wms.example.com");
        layer2.setType("wms");


        Mockito.when(
                layerService.getLayer(Mockito.eq(1),
                        Mockito.anyBoolean(),
                        Mockito.any(LayerAction.class))).thenReturn(layer1);
        Mockito.when(
                layerService.getLayer(Mockito.eq(2),
                        Mockito.anyBoolean(),
                        Mockito.any(LayerAction.class))).thenReturn(layer2);
    }

    /**
     * Test proxy for WMS/WMTS GetCapabilities.
     *
     * @throws Exception the exception
     */
    @Test
    public void testProxyWMSCapabilities() throws Exception {
        mockMvc.perform(
            get("/api/proxy/layer/2/1.00/GetCapalibites.xml").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                get("/api/proxy/layer/2/?service=wms&request=GetCapabilities").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());
    }

    @Test
    public void testProxyAgfsCapabilities() throws Exception {
        mockMvc.perform(
                get("/api/proxy/layer/1/?f=json").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                get("/api/proxy/layer/1/?f=pjson").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());
    }

    @Test
    public void testProxyAgfsAddFeaturesPOST() throws Exception {
        mockMvc.perform(
                post("/api/proxy/layer/1/addFeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/addFeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/addfeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/addfeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());
    }

    @Test
    public void testProxyAgfsAddFeaturesGET() throws Exception {
        mockMvc.perform(
                get("/api/proxy/layer/1/addFeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());

        mockMvc.perform(
                get("/api/proxy/layer/1/addFeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());
    }

    @Test
    public void testProxyAgfsDeleteFeaturesPOST() throws Exception {
        mockMvc.perform(
                post("/api/proxy/layer/1/deleteFeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/deleteFeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/deletefeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/deletefeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());
    }

    @Test
    public void testProxyAgfsDeleteFeaturesGET() throws Exception {
        mockMvc.perform(
                get("/api/proxy/layer/1/deleteFeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());

        mockMvc.perform(
                get("/api/proxy/layer/1/deleteFeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());
    }

    @Test
    public void testProxyAgfsQueryFeatures() throws Exception {
        mockMvc.perform(
                post("/api/proxy/layer/1/query/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                get("/api/proxy/layer/1/query").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());
    }
    @Test
    public void testProxyAgfsUpdateFeaturesPOST() throws Exception {
        mockMvc.perform(
                post("/api/proxy/layer/1/updateFeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/updateFeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/updatefeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());

        mockMvc.perform(
                post("/api/proxy/layer/1/updatefeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isOk());
    }

    @Test
    public void testProxyAgfsUpdateFeaturesGET() throws Exception {
        mockMvc.perform(
                get("/api/proxy/layer/1/updateFeatures/").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());

        mockMvc.perform(
                get("/api/proxy/layer/1/updateFeatures").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());
    }

    @Test
    public void testProxyAgfsUnsupportedAction() throws Exception {
        mockMvc.perform(
                get("/api/proxy/layer/1/deleteAttachments").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());

        mockMvc.perform(
                get("/api/proxy/layer/1/addAttachment").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());

        mockMvc.perform(
                get("/api/proxy/layer/1/anything").headers(OAMHeaderHelper.getAdminHeaders())
        ).andExpect(status().isNotFound());
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
