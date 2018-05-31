package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.LayerGroup;
import fi.sitowise.ksr.service.LayerGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/layergroup")
public class LayerGroupController {

    private final LayerGroupService layerGroupService;

    @Autowired
    public LayerGroupController(LayerGroupService layerGroupService) {
        this.layerGroupService = layerGroupService;
    }

    /**
     * Get all Layergroups the user has permissions.
     *
     * @return List of layergroups
     */
    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public List<LayerGroup> getLayerGroups() {
        return this.layerGroupService.getLayerGroups();
    }

}
