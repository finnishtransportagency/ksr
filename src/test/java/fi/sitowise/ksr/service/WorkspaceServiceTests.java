package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.exceptions.KsrApiException;
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
import java.util.UUID;

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

    /**
     * Test removing workspace that does not exist.
     */
    @Test
    public void testRemoveWorkspaceNotFound() {
        Assert.assertFalse(workspaceService.deleteWorkspace("test workspace", "test-user"));
    }

    /**
     * Test removing workspace that exists.
     */
    @Test
    public void testRemoveWorkspaceOk() {
        Mockito.doReturn(true).when(workspaceRepository)
                .deleteWorkspace("test workspace", "test-user");
        Assert.assertTrue(workspaceService.deleteWorkspace("test workspace", "test-user"));
    }

    /**
     * Test get workspace that exists.
     */
    @Test
    public void testGetWorkspaceOk() {
        Workspace workspace = new Workspace();
        workspace.setUuid(UUID.fromString("5e42a6a5-9f09-4f59-96d7-ef37c7e6f9a4"));
        workspace.setName("Test workspace 1");
        workspace.setId(1L);

        Mockito.when(workspaceRepository.fetchWorkspaceByUuid(
                Mockito.eq(UUID.fromString("5e42a6a5-9f09-4f59-96d7-ef37c7e6f9a4")),
                Mockito.any())
        ).thenReturn(workspace);

        Workspace expected = new Workspace();
        expected.setUuid(UUID.fromString("5e42a6a5-9f09-4f59-96d7-ef37c7e6f9a4"));
        expected.setName("Test workspace 1");
        expected.setId(1L);

        Workspace returned = workspaceService.getWorkspaceByUuid(UUID.fromString("5e42a6a5-9f09-4f59-96d7-ef37c7e6f9a4"));

        Assert.assertEquals(expected.getName(), returned.getName());
        Assert.assertEquals(expected.getId(), returned.getId());
        Assert.assertEquals(expected.getUuid(), returned.getUuid());
    }

    /**
     * Test get workspace that does not exists.
     */
    @Test(expected = KsrApiException.NotFoundErrorException.class)
    public void testGetWorkspaceNotFound() {
        Mockito.when(workspaceRepository.fetchWorkspaceByUuid(Mockito.any(), Mockito.any())).thenReturn(null);
        workspaceService.getWorkspaceByUuid(UUID.randomUUID());
    }

}
