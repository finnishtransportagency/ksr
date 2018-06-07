package fi.sitowise.ksr.service;

import fi.sitowise.ksr.repository.LayerRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Layer service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = LayerService.class)
public class LayerServiceTests {

    @Autowired
    private LayerService layerService;

    /**
     * The Layer repository.
     */
    @MockBean
    LayerRepository layerRepository;

    /**
     * The Layer group service.
     */
    @MockBean
    LayerGroupService layerGroupService;

    /**
     * Test get layer url with response.
     */
    @Test
    public  void testGetLayerUrlWithResponse() {
        String returnUrl = "http://test.example.com/arcgis/services/WMS/MapServer/WMSServer?";
        Mockito.when(layerService.getLayerUrl(1)).thenReturn(returnUrl);
        Assert.assertEquals(returnUrl,layerService.getLayerUrl(1));
    }

    /**
     * Test get layer url without response.
     */
    @Test
    public  void testGetLayerUrlWithoutResponse() {
        Mockito.when(layerService.getLayerUrl(1)).thenReturn(null);
        Assert.assertNull(layerService.getLayerUrl(1));
    }
}
