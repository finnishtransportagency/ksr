package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Map;

/**
 * Workspace service.
 */
@Service
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;

    /**
     * Instantiates new workspace service.
     *
     * @param workspaceRepository workspace repository
     */
    @Autowired
    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    /**
     * Save new workspace to database.
     *
     * @param workspace workspace to be saved
     * @param username username of the user whom the workspace is saved for
     */
    public void saveWorkspace(Workspace workspace, String username) {
        workspaceRepository.saveWorkspace(workspace, username);
    }

    /**
     * Check workspace name existence in database for a user.
     *
     * @param username name of user
     * @param name name of workspace
     * @return workspace name existence in database
     */
    public boolean getWorkspaceExistence(String username, String name) {
        return workspaceRepository.getWorkspaceExistence(username, name);
    }

    /**
     * Delete existing workspace from database.
     *
     * @param workspaceName name of the workspace to be deleted
     * @param username username of the user whose workspace is being deleted
     * @return whether the workspace was found and deleted or not
     */
    public boolean deleteWorkspace(String workspaceName, String username) {
        return workspaceRepository.deleteWorkspace(workspaceName, username);
    }

    /**
     * Fetch map of workspace names and update times for given user.
     *
     * @param username username of the user whose workspaces are fetched
     * @return map of workspace names and update times
     */
    public Map<Timestamp, String> getWorkspaceListForUser(String username) {
        return workspaceRepository.fetchWorkspaceListForUser(username);
    }
}
