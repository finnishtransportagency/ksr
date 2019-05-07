package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.repository.LayerRepository;
import fi.sitowise.ksr.repository.UserLayerRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getCurrentUserGroups;

/**
 * Layer service.
 */
@Service
public class LayerService {
    private static final Logger log = LogManager.getLogger(LayerService.class);

    private final LayerRepository layerRepository;
    private final UserLayerRepository userLayerRepository;

    /**
     * Instantiates a new Layer service.
     *
     * @param layerRepository   the layer repository
     * @param userLayerRepository the user layer repository
     */
    @Autowired
    public LayerService(LayerRepository layerRepository, UserLayerRepository userLayerRepository) {
        this.layerRepository = layerRepository;
        this.userLayerRepository = userLayerRepository;
    }

    /**
     * Gets layer.
     *
     * @param id layer's id
     * @param isQuery whether the layer is requested for a search request or not
     * @return the layer
     */
    public Layer getLayer(int id, boolean isQuery, LayerAction actionType) {
        List<String> userGroups = getCurrentUserGroups();
        if (userGroups == null) {
            return null;
        }
        Layer layer = layerRepository.getLayer(id, userGroups, isQuery, actionType);

        //TODO: Check permission for userlayer
        return layer == null ? userLayerRepository.getUserLayer(id) : layer;
    }

    /**
     * Gets layers that reference to given layer.
     *
     * @param layerId layer's id
     * @return list of layers
     */
    List<Layer> getReferencingLayers(String layerId) {
        List<String> userGroups = getCurrentUserGroups();
        if (userGroups == null) {
            log.info("Failed to query referencing layers. User has no userGroups.");
            return Collections.emptyList();
        }
        return layerRepository.getReferencingLayers(Integer.parseInt(layerId), userGroups);
    }
}
