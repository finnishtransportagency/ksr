package fi.sitowise.ksr.service;

import fi.sitowise.ksr.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

/**
 * Workspace service.
 */
@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    /**
     * Instantiates a new Workspace service.
     *
     * @param workspaceRepository workspace repository
     */
    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
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
}
