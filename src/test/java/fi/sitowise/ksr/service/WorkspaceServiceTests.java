package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.repository.WorkspaceRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

/**
 * Workspace service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = WorkspaceService.class)
public class WorkspaceServiceTests {
    @Autowired
    WorkspaceService workspaceService;

    @MockBean
    WorkspaceRepository workspaceRepository;

    /**
     * Test add workspace.
     */
    @Test
    public void testSaveWorkspaceOk() {
        Workspace workspace = new Workspace();
        workspace.setName("test workspace");
        workspace.setScale(2000);
        workspace.setCenterLongitude(100);
        workspace.setCenterLatitude(100);
        workspace.setLayers(new ArrayList<>());

        workspaceService.saveWorkspace(workspace, "test-user");
    }

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
        Mockito.when(workspaceService.getWorkspaceExistence("TestUser","workspaceName")).thenReturn(true);
        Assert.assertTrue(workspaceService.getWorkspaceExistence("TestUser", "workspaceName"));
    }
}
