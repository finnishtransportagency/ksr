package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.UserLayerService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.exception.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;

import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getCurrentUsername;

/**
 * Rest controller for user layer
 */
@RestController
@RequestMapping(value = "/api/user-layer")
public class UserLayerController {

    private final UserLayerService userLayerService;

    private static final Logger LOG = LogManager.getLogger(UserLayerController.class);

    @Autowired
    public UserLayerController(UserLayerService userLayerService) {
        this.userLayerService = userLayerService;
    }

    /**
     * Add user layer to database
     * @param layer requestbody JSON object that contains layer values to be added
     * @param userAgent requestheader that contains info about current device
     */
    @RequestMapping(value = "", method = RequestMethod.POST)
    public Layer postUserLayer(@Valid @RequestBody Layer layer, @RequestHeader(value = "User-Agent") String userAgent) {
        LOG.info(String.format("%s: Add user layer to database.", getCurrentUsername()));
        String[] mobileAgents = {"Mobile", "Tablet", "Mobi", "IEMobile"};
        boolean isMobile = Arrays.stream(mobileAgents).parallel().anyMatch(userAgent::contains);

        try {
            return userLayerService.addUserLayer(getCurrentUsername(), layer, isMobile);
        } catch (DataAccessException e) {
            throw new KsrApiException.InternalServerErrorException("Error creating new user layer", e);
        }
    }

    /**
     * Remove user layer from database
     * @param userLayerId int Id of the layer to be deleted
     */
    @RequestMapping(value = "/{userLayerId}", method = RequestMethod.DELETE)
    public void removeUserLayer(@PathVariable("userLayerId") int userLayerId) {
        userLayerService.removeUserLayer(getCurrentUsername(), userLayerId);
    }
}
