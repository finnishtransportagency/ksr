package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Workspace;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.WorkspaceService;
import org.jooq.exception.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Workspace controller.
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
    public void saveWorkspace(@RequestBody Workspace workspace) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            workspaceService.saveWorkspace(workspace, authentication.getName());
        } catch (DataAccessException e) {
            throw new KsrApiException.InternalServerErrorException(
                    "Failed to save new workspace.", e);
        }
    }
}
