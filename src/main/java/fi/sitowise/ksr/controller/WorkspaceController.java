package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.WorkspaceService;
import org.jooq.exception.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.sql.Timestamp;
import java.util.Map;

/**
 * Workspace rest controller.
 */
@RestController
@RequestMapping(value = "/api/workspace")
public class WorkspaceController {
    private final WorkspaceService workspaceService;

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
     */
    @RequestMapping(value = "", method = RequestMethod.POST)
    public void saveWorkspace(@Valid @RequestBody Workspace workspace) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            workspaceService.saveWorkspace(workspace, authentication.getName());
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            return workspaceService.getWorkspaceExistence(authentication.getName(), name);
        } catch (DataAccessException e) {
            throw new KsrApiException.InternalServerErrorException("Error when checking workspace existence.", e);
        }
    }

    /**
     * Delete existing workspace from database.
     *
     * @param workspaceName name of the workspace to be deleted from database
     */
    @RequestMapping(value = "", method = RequestMethod.DELETE)
    public void saveWorkspace(@RequestParam String workspaceName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!workspaceService.deleteWorkspace(workspaceName, authentication.getName())) {
            throw new KsrApiException.NotFoundErrorException(
                    "No workspace found with the given name to be deleted.");
        }
    }

    /**
     * Fetch map of workspace names and update times for current user.
     *
     * @return map of workspace names and update times
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Map<Timestamp, String> getWorkspaceList() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return workspaceService.getWorkspaceListForUser(authentication.getName());
    }
}
