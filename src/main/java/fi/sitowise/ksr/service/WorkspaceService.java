package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.repository.WorkspaceRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getCurrentUserGroups;

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
        String uuid = workspaceRepository.deleteWorkspace(workspaceName, username);
        return StringUtils.isNotEmpty(uuid);
    }

    /**
     * Fetch list of workspaces for given user.
     *
     * @param username username of the user whose workspaces are fetched
     * @return list of workspaces
     */
    public List<Workspace> getWorkspaceListForUser(String username) {
        return workspaceRepository.fetchWorkspaceListForUser(username);
    }

    /**
     * Fetch details for single workspace. If no workspace name is given
     * the latest user workspace is returned for the user.
     *
     * @param workspaceName name of the workspace to be fetched
     * @param username username of the user whose workspace is being fetched
     * @param isPublic Whether the workspace is public or not.
     * @return workspace details
     */
    public Workspace getWorkspaceDetails(String workspaceName, String username, boolean isPublic) {
        return workspaceRepository.fetchWorkspaceDetails(workspaceName, username, isPublic);
    }

    /**
     * Fetch a single workspace by Uuid.
     *
     * If workspace cannot be found, then will raise a 404 exception.
     *
     * @param uuid Uuid of the workspace to be fetched
     * @return workspace
     */
    public Workspace getWorkspaceByUuid(UUID uuid) {
        Workspace workspace = workspaceRepository.fetchWorkspaceByUuid(uuid, getCurrentUserGroups());
        if (workspace == null) {
            throw new KsrApiException.NotFoundErrorException(String.format("Workspace: %s not found.", uuid.toString()));
        }
        return workspace;
    }
}
