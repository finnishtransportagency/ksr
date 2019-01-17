package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.authentication.OAMAuthenticationToken;
import fi.sitowise.ksr.authentication.User;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Rest controller for user.
 */
@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    /**
     * Get user information
     * @param request HttpServerRequest
     * @return user information
     */
    @ApiOperation("Get user information.")
    @GetMapping(value = "")
    public User getUserInformation(HttpServletRequest request) {
        OAMAuthenticationToken authToken = (OAMAuthenticationToken) request.getUserPrincipal();
        return authToken.getUser();
    }
}
