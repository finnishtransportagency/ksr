package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.service.UserLayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest controller for user layer
 */
@RestController
@RequestMapping(value = "/api/user-layer")
public class UserLayerController {

    private final UserLayerService userLayerService;

    @Autowired
    public UserLayerController(UserLayerService userLayerService) {
        this.userLayerService = userLayerService;
    }

    /**
     * Add user layer to database
     * @param layer requestbody JSON object that contains layer values to be added
     */
    @RequestMapping(value = "", method = RequestMethod.POST)
    public void postUserLayer(@RequestBody Layer layer) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userLayerService.addUserLayer(authentication.getName(), layer);
    }
}
