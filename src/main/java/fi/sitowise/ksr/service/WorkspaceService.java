package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
     * Delete existing workspace from database.
     *
     * @param workspaceName name of the workspace to be deleted
     * @param username username of the user whose workspace is being deleted
     * @return whether the workspace was found and deleted or not
     */
    public boolean deleteWorkspace(String workspaceName, String username) {
        return workspaceRepository.deleteWorkspace(workspaceName, username);
    }
}
