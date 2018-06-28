package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
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
        Layer l = new Layer();
        l.setUrl("http://test.example.com/arcgis/services/WMS/MapServer/WMSServer?");
        Mockito.when(layerService.getLayer(1, false)).thenReturn(l);
        Assert.assertEquals(l, layerService.getLayer(1, false));
    }

    /**
     * Test get layer url without response.
     */
    @Test
    public  void testGetLayerUrlWithoutResponse() {
        Mockito.when(layerService.getLayer(1, false)).thenReturn(null);
        Assert.assertNull(layerService.getLayer(1, false));
    }
}
