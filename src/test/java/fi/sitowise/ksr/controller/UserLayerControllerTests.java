package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.UserLayerService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests for UserLayerController
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {UserLayerController.class})
@ComponentScan(
        basePackages = {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config"}
)
public class UserLayerControllerTests extends AuthControllerTestBase {

    @MockBean
    UserLayerService userLayerService;

    @Before
    public void setup() { init(); }

    @Test
    public void testDeleteNotFound() throws Exception {
        Mockito.doThrow(new KsrApiException.NotFoundErrorException(""))
                .when(userLayerService).removeUserLayer(Mockito.anyString(), Mockito.anyInt());
        this.mockMvc.perform(
                delete("/api/user-layer/123").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
        ).andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteOk() throws Exception {
        Mockito.doNothing().when(userLayerService).removeUserLayer(Mockito.anyString(), Mockito.anyInt());
        this.mockMvc.perform(
                delete("/api/user-layer/123").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
        ).andExpect(status().isOk());
    }

}
