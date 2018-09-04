package fi.sitowise.ksr.controller;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Workspace controller tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {WorkspaceController.class})
@ComponentScan( basePackages = {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config"})
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
        Mockito.doReturn(true).when(workspaceService).getWorkspaceExistence("TestUser","workspaceName");
        MvcResult result = this.mockMvc.perform(get("/api/workspace/exists").headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
                .param("name", "workspaceName")
        ).andExpect(status().isOk()).andReturn();
        Assert.assertEquals("true", result.getResponse().getContentAsString());
    }
}
