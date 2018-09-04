package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.WorkspaceService;
import org.jooq.exception.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Rest controller for workspace.
 */
@RestController
@RequestMapping(value = "/api/workspace")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    /**
     * Instantiates a new Workspace controller.
     *
     * @param workspaceService workspace service
     */
    @Autowired
    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
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
}
