package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.repository.LayerRepository;
import fi.sitowise.ksr.repository.UserLayerRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Layer service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = LayerService.class)
public class LayerServiceTests {

    /**
     * The Layer repository.
     */
    @MockBean
    LayerRepository layerRepository;

    /**
     * The User Layer repository.
     */
    @MockBean
    UserLayerRepository userLayerRepository;

    @Autowired
    LayerService layerService;

    /**
     * Test get layer url with response.
     */
    @Test
    @WithMockUser(username = "K12345")
    public void testGetLayerUrlWithResponse() {
        Layer l = new Layer();
        l.setUrl("http://test.example.com/arcgis/services/WMS/MapServer/WMSServer?");
        Mockito.when(layerRepository.getLayer(
                Mockito.eq(1),
                Mockito.any(),
                Mockito.eq(false),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(l);
        Layer received = layerService.getLayer(1, false, LayerAction.READ_LAYER);
        Assert.assertEquals(l.getUrl(), received.getUrl());
    }

    /**
     * Test get layer url without response.
     */
    @Test
    @WithMockUser(username = "K12345")
    public void testGetLayerUrlWithoutResponse() {
        Mockito.when(layerRepository.getLayer(
                Mockito.eq(1),
                Mockito.any(),
                Mockito.eq(false),
                Mockito.eq(LayerAction.READ_LAYER)
        )).thenReturn(null);
        Mockito.when(userLayerRepository.getUserLayer(Mockito.eq(1))).thenReturn(null);
        Assert.assertNull(layerService.getLayer(1, false, LayerAction.READ_LAYER));
    }
}
