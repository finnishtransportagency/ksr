package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.service.LayerGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

/**
 * Layer group controller.
 */
@RestController
@RequestMapping(value = "/api/layergroup")
public class LayerGroupController {

    private final LayerGroupService layerGroupService;

    /**
     * Instantiates a new Layer group controller.
     *
     * @param layerGroupService the layer group service
     */
    @Autowired
    public LayerGroupController(LayerGroupService layerGroupService) {
        this.layerGroupService = layerGroupService;
    }

    /**
     * Get all Layergroups the user has permissions.
     *
     * @param userAgent the user agent
     * @return List of layergroups
     */
    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public List<LayerGroup> getLayerGroups(@RequestHeader(value = "User-Agent") String userAgent) {
        String[] mobileAgents = {"Mobile", "Tablet", "Mobi", "IEMobile"};
        boolean isMobile = Arrays.stream(mobileAgents).parallel().anyMatch(userAgent::contains);
        return this.layerGroupService.getLayerGroups(isMobile);
    }

}
