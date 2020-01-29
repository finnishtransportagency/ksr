package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.WorkspaceService;
import io.swagger.annotations.ApiOperation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.exception.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;
import java.util.UUID;

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
    @ApiOperation("Save new workspace to database.")
    @PostMapping(value = "")
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
    @ApiOperation("Gets workspace name existence.")
    @GetMapping(value = "/exists")
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
    @ApiOperation("Delete existing workspace from database.")
    @DeleteMapping(value = "")
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
    @ApiOperation("Fetch map of workspace names and update times for current user.")
    @GetMapping(value = "/list")
    public List<Workspace> getWorkspaceList() {
        LOG.info(String.format("%s: Fetch map of workspace names and update times for current user.", getCurrentUsername()));
        return workspaceService.getWorkspaceListForUser(getCurrentUsername());
    }

    /**
     * Fetch a single workspace with uuid.
     *
     * @return matching workspace if any
     */
    @ApiOperation("Fetch a single workspace with uuid.")
    @GetMapping(value = "/{uuid}")
    public Workspace getWorkspaceByUuid(@PathVariable UUID uuid) {
        LOG.info(String.format("%s: Fetch workspace [%s]", getCurrentUsername(), uuid.toString()));
        return workspaceService.getWorkspaceByUuid(uuid);
    }

    /**
     * Fetch details for single workspace. If no workspace name is given
     * the latest user workspace is returned for the current user.
     *
     * @param workspaceName name of the workspace to be fetched
     * @param isPublic Whether the workspace is public or not.
     * @return details of the workspace
     */
    @ApiOperation("Fetch details for single workspace.")
    @GetMapping(value = "")
    public Workspace getWorkspaceDetails(@RequestParam (required = false) String workspaceName, boolean isPublic) {
        LOG.info(String.format("%s: Fetch details for single workspace.", getCurrentUsername()));
        Workspace workspace = workspaceService.getWorkspaceDetails(workspaceName, getCurrentUsername(), isPublic);

        if (workspace == null) {
            throw new KsrApiException.NotFoundErrorException("No workspace can be found.");
        }

        return workspace;
    }
}
