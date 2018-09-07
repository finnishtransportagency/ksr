package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.repository.UserLayerRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * User layer service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = UserLayerService.class)
public class UserLayerServiceTests {

    @Autowired
    UserLayerService userLayerService;

    @MockBean
    UserLayerRepository userLayerRepository;

    /**
     * Test add user layer
     */
    @Test
    public void testAddUserLayerOk() {
        Layer layer = new Layer();
        layer.setName("Layer name");
        layer.setType("AGFS");
        layer.setUrl("test.url.com");
        layer.setLayers("layers");
        layer.setStyles("default");
        layer.setOpacity(1.0);
        layer.setMinScale(0);
        layer.setMaxScale(0);
        layer.setTransparent("1");
        layer.setAttribution("Test");
        layer.setDesktopVisible("1");
        layer.setMobileVisible("1");

        Mockito.when(userLayerRepository.addUserLayer(Mockito.anyString(), Mockito.anyString(),
                Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyDouble(),
                Mockito.anyInt(), Mockito.anyInt(), Mockito.anyString(), Mockito.anyString(),
                Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(123);
        Mockito.when(userLayerRepository.getUserLayer(123)).thenReturn(layer);
        userLayerService.addUserLayer("test-user", layer, false);
    }

    /**
     * Test remove a user layer, that does not exists.
     */
    @Test(expected = KsrApiException.NotFoundErrorException.class)
    public void testRemoveLayerNotFound() {
        Mockito.doThrow(new KsrApiException.NotFoundErrorException("")).when(userLayerRepository)
                .removeUserLayer("test-user", 123);

        userLayerService.removeUserLayer("test-user", 123);
    }

    /**
     * Test remove a user layer, that exists.
     */
    @Test
    public void testRemoveLayerOk() {
        Mockito.doNothing().when(userLayerRepository).removeUserLayer("test-user", 456);
        userLayerService.removeUserLayer("test-user", 456);
    }

    /**
     * Test remove a user layer with a null-user.
     */
    @Test(expected = KsrApiException.ForbiddenException.class)
    public void testRemoveLayerWithoutUser() {
        userLayerService.removeUserLayer(null, 456);
    }
}
