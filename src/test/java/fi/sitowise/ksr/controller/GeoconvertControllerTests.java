package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.GeoconvertService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Geoconvert controller tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {GeoconvertController.class})
public class GeoconvertControllerTests extends AuthControllerTestBase {

    /**
     * The Geoconvert service.
     */
    @MockBean
    GeoconvertService geoconvertService;

    /**
     * Sets webAppContext and springSecurity.
     */
    @Before
    public void setup() {
        init();
    }

    /**
     * Test get geoconvert data with correct parameters.
     *
     * @throws Exception the exception
     */
    @Test
    public void testGetGeoconvertDataIsOk() throws Exception {
        this.mockMvc.perform(get("/api/geoconvert")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36")
                .param("y", "123")
                .param("x", "123")
                .param("featureType", "road"))
                .andExpect(status().isOk());
    }

    /**
     * Test get geoconvert data with wrong parameters.
     *
     * @throws Exception the exception
     */
    @Test
    public void testGetGeoconvertDataIsBadRequest() throws Exception {
        this.mockMvc.perform(get("/api/geoconvert")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36")
                .param("test", "123")
                .param("type", "road"))
                .andExpect(status().isBadRequest());
    }
}
