package fi.sitowise.ksr.service;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Workspace service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = WorkspaceService.class)
public class WorkspaceServiceTests {

    /**
     * Workspace service.
     */
    @MockBean
    WorkspaceService workspaceService;

    /**
     * Test workspace does not exist.
     */
    @Test
    public void testWorkspaceDoesNotExist() {
        Assert.assertFalse(workspaceService.getWorkspaceExistence("test", "workspace"));
    }

    /**
     * Test workspace does exist.
     */
    @Test
    public void testWorkspaceDoesExist() {
        Mockito.doReturn(true).when(workspaceService).getWorkspaceExistence("TestUser","workspaceName");
        Assert.assertTrue(workspaceService.getWorkspaceExistence("TestUser", "workspaceName"));
    }

}
