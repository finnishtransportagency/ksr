package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.LayerGroupService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The type Layer group controller tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {LayerGroupController.class})
public class LayerGroupControllerTests extends AuthControllerTestBase {

    /**
     * The Layer group service.
     */
    @MockBean
    LayerGroupService layerGroupService;

    /**
     * Sets .
     */
    @Before
    public void setup() {
        init();
    }

    /**
     * Test get layer groups.
     *
     * @throws Exception the exception
     */
    @Test
    public void testGetLayerGroups() throws Exception {
        this.mockMvc.perform(get("/api/layergroup")).andExpect(status().isForbidden());

        Mockito.when(layerGroupService.getLayerGroups()).thenReturn(new ArrayList<>());
        this.mockMvc.perform(get("/api/layergroup")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))).andExpect(status().isOk());
    }
}
