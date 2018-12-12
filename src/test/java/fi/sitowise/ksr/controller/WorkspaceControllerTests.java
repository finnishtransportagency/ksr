package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.WorkspaceService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.AdditionalMatchers.not;

/**
 * Tests for WorkspaceController.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {WorkspaceController.class})
@ComponentScan(
        basePackages = {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config"}
) 
public class WorkspaceControllerTests extends AuthControllerTestBase {

    /**
     * Workspace service.
     */
    @MockBean
    WorkspaceService workspaceService;

    /**
     * Sets webAppContext and springSecurity.
     */
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
    
    /**
     * Test workspace does not exist.
     *
     * @throws Exception if mockMvc request fails
     */
    @Test
    public void testWorkspaceDoesNotExist() throws Exception {
        MvcResult result = this.mockMvc.perform(get("/api/workspace/exists").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
                .param("name", "workspaceName")
        ).andExpect(status().isOk()).andReturn();
        Assert.assertEquals("false", result.getResponse().getContentAsString());
    }

    /**
     * Test workspace does exist.
     *
     * @throws Exception if mockMvc request fails
     */
    @Test
    public void testWorkspaceDoesExist() throws Exception {
        Mockito.doReturn(true).when(workspaceService).getWorkspaceExistence("TestUser", "workspaceName");
        MvcResult result = this.mockMvc.perform(get("/api/workspace/exists").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
                .param("name", "workspaceName")
        ).andExpect(status().isOk()).andReturn();
        Assert.assertEquals("true", result.getResponse().getContentAsString());
    }

    /**
     * Test fetching workspace list.
     *
     * @throws Exception if mock request fails
     */
    @Test
    public void testFetchWorkspaceListOk() throws Exception {
        Mockito.when(workspaceService.getWorkspaceListForUser(Mockito.anyString()))
                .thenReturn(new ArrayList<>());
        this.mockMvc.perform(
                get("/api/workspace/list").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
        ).andExpect(status().isOk());
    }

    /**
     * Test fetch workspace by Uuid.
     *
     * @throws Exception if mock request fails
     */
    @Test
    public void testFetchWorkspaceByUuidOk() throws Exception {
        Workspace workspace = new Workspace();
        workspace.setId(2L);

        Mockito.when(workspaceService.getWorkspaceByUuid(
                Mockito.eq(UUID.fromString("28db6440-911e-41dc-ad1a-4d1961e96561")))
        ).thenReturn(workspace);

        Mockito.when(workspaceService.getWorkspaceByUuid(
                not(Mockito.eq(UUID.fromString("28db6440-911e-41dc-ad1a-4d1961e96561"))))
        ).thenThrow(new KsrApiException.NotFoundErrorException(
                "Workspace: 28db6440-911e-41dc-ad1a-4d1961e96561 not found."
        ));

        this.mockMvc.perform(
                get("/api/workspace/28db6440-911e-41dc-ad1a-4d1961e96561")
                        .headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
        ).andExpect(status().isOk());
    }

    /**
     * Test fetch workspace by Uuid not found.
     *
     * @throws Exception if mock request fails
     */
    @Test
    public void testFetchWorkspaceByUuidNotFound() throws Exception {
        Workspace workspace = new Workspace();
        workspace.setId(2L);

        Mockito.when(workspaceService.getWorkspaceByUuid(
                Mockito.eq(UUID.fromString("28db6440-911e-41dc-ad1a-4d1961e96561")))
        ).thenThrow(new KsrApiException.NotFoundErrorException(
                "Workspace: 28db6440-911e-41dc-ad1a-4d1961e96561 not found."
        ));

        this.mockMvc.perform(
                get("/api/workspace/28db6440-911e-41dc-ad1a-4d1961e96561")
                        .headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
        ).andExpect(status().isNotFound());
    }
}
