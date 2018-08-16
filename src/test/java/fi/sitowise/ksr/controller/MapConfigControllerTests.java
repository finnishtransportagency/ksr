package fi.sitowise.ksr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fi.sitowise.ksr.domain.MapConfig;
import fi.sitowise.ksr.helper.AuthControllerTestBase;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * MapConfig controller tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {MapConfigController.class})
public class MapConfigControllerTests extends AuthControllerTestBase {

    @Value("${map.center.lng}")
    private int centerLng;

    @Value("${map.center.lat}")
    private int centerLat;

    @Value("${map.scale}")
    private int scale;

    @Value("${print.service.url}")
    private String printServiceUrl;

    /**
     * Sets webAppContext and springSecurity.
     */
    @Before
    public void setup() {
        init();
    }

    /**
     * Gets test map information.
     *
     * @throws Exception the exception
     */
    @Test
    public void getTestMapInformation() throws Exception {
        MapConfig mapConfigData = new MapConfig();
        mapConfigData.setCenter(new int[]{centerLng, centerLat});
        mapConfigData.setScale(scale);
        mapConfigData.setPrintServiceUrl(PrintController.PRINT_CONTROLLER_URL);

        MvcResult result = this.mockMvc.perform(get("/api/map")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN")))
                .andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();
        String mapDataString = mapper.writeValueAsString(mapConfigData);

        Assert.assertEquals(mapDataString, result.getResponse().getContentAsString());
    }
}
