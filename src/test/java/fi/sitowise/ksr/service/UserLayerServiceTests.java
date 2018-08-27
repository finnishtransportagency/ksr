package fi.sitowise.ksr.service;

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
