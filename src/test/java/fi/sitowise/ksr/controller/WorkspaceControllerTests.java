package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.WorkspaceService;
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
 * Tests for WorkspaceController.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {WorkspaceController.class})
@ComponentScan(
        basePackages = {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config"}
)
public class WorkspaceControllerTests extends AuthControllerTestBase {

    @MockBean
    WorkspaceService workspaceService;

    @Before
    public void setup() { init(); }

    /**
     * Test deleting workspace that does not exist.
     *
     * @throws Exception if mock request fails
     */
    @Test
    public void testDeleteWorkspaceNotFound() throws Exception {
        Mockito.doThrow(new KsrApiException.NotFoundErrorException(""))
                .when(workspaceService).deleteWorkspace(Mockito.anyString(), Mockito.anyString());
        this.mockMvc.perform(
                delete("/api/workspace").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
                .param("workspaceName", "test workspace")
        ).andExpect(status().isNotFound());
    }

    /**
     * Test deleting workspace that exists.
     *
     * @throws Exception if mock request fails
     */
    @Test
    public void testDeleteWorkspaceOk() throws Exception {
        Mockito.doReturn(true).when(workspaceService).deleteWorkspace(Mockito.anyString(), Mockito.anyString());
        this.mockMvc.perform(
                delete("/api/workspace").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
                .param("workspaceName", "test workspace")
        ).andExpect(status().isOk());
    }
}
