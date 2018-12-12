package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.WorkspaceService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.exception.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getCurrentUsername;

/**
 * Workspace rest controller.
 */
@RestController
@RequestMapping(value = "/api/workspace")
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    private static final Logger LOG = LogManager.getLogger(WorkspaceController.class);

    /**
     * Instantiates new workspace controller.
     *
     * @param workspaceService workspace service
     */
    @Autowired
    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    /**
     * Save new workspace to database.
     *
     * @param workspace workspace to be saved into database
     * @return list of workspaces
     */
    @RequestMapping(value = "", method = RequestMethod.POST)
    public List<Workspace> saveWorkspace(@Valid @RequestBody Workspace workspace) {
        LOG.info(String.format("%s: Save new workspace to database.", getCurrentUsername()));
        try {
            workspaceService.saveWorkspace(workspace,  getCurrentUsername());
            return workspaceService.getWorkspaceListForUser(getCurrentUsername());
        } catch (DataAccessException e) {
            throw new KsrApiException.InternalServerErrorException(
                    "Failed to save new workspace.", e);
        }
    }
    
    /**
     * Gets workspace name existence.
     *
     * @param name name of workspace
     * @return workspace name existence
     */
    @RequestMapping(value = "/exists", method = RequestMethod.GET)
    public boolean getWorkspaceExistence(@RequestParam String name) {
        LOG.info(String.format("%s: Gets workspace name existence.", getCurrentUsername()));
        try {
            return workspaceService.getWorkspaceExistence(getCurrentUsername(), name);
        } catch (DataAccessException e) {
            throw new KsrApiException.InternalServerErrorException("Error when checking workspace existence.", e);
        }
    }

    /**
     * Delete existing workspace from database.
     *
     * @param workspaceName name of the workspace to be deleted from database
     * @return list of workspaces
     */
    @RequestMapping(value = "", method = RequestMethod.DELETE)
    public List<Workspace> deleteWorkspace(@RequestParam String workspaceName) {
        LOG.info(String.format("%s: Delete existing workspace from database.", getCurrentUsername()));
        if (!workspaceService.deleteWorkspace(workspaceName, getCurrentUsername())) {
            throw new KsrApiException.NotFoundErrorException(
                    "No workspace found with the given name to be deleted.");
        }
        return workspaceService.getWorkspaceListForUser(getCurrentUsername());
    }

    /**
     * Fetch map of workspace names and update times for current user.
     *
     * @return list of workspaces
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public List<Workspace> getWorkspaceList() {
        LOG.info(String.format("%s: Fetch map of workspace names and update times for current user.", getCurrentUsername()));
        return workspaceService.getWorkspaceListForUser(getCurrentUsername());
    }

    /**
     * Fetch details for single workspace. If no workspace name is given
     * the latest workspace is returned for the current user.
     *
     * @param workspaceName name of the workspace to be fetched
     * @return details of the workspace
     */
    @RequestMapping(value = "", method = RequestMethod.GET)
    public Workspace getWorkspaceDetails(@RequestParam (required = false) String workspaceName) {
        LOG.info(String.format("%s: Fetch details for single workspace.", getCurrentUsername()));
        Workspace workspace = workspaceService.getWorkspaceDetails(workspaceName, getCurrentUsername());

        if (workspace == null) {
            throw new KsrApiException.NotFoundErrorException("No workspace can be found.");
        }

        return workspace;
    }
}
