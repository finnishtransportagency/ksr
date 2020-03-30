package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.Relation;
import fi.sitowise.ksr.repository.LayerRepository;
import fi.sitowise.ksr.repository.RelationRepository;
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
    private final RelationRepository relationRepository;

    /**
     * Instantiates a new Layer service.
     *
     * @param layerRepository     the layer repository.
     * @param userLayerRepository the user layer repository.
     * @param relationRepository  the relation repository.
     */
    @Autowired
    public LayerService(LayerRepository layerRepository, UserLayerRepository userLayerRepository,
                        RelationRepository relationRepository) {
        this.layerRepository = layerRepository;
        this.userLayerRepository = userLayerRepository;
        this.relationRepository = relationRepository;
    }

    /**
     * Gets layer.
     *
     * @param id      layer's id
     * @param isQuery whether the layer is requested for a search request or not
     * @return the layer
     */
    public Layer getLayer(int id, boolean isQuery, LayerAction actionType) {
        List<String> userGroups = getCurrentUserGroups();
        if (userGroups == null) {
            return null;
        }
        Layer layer = layerRepository.getLayer(id, userGroups, isQuery, actionType);
        if (layer != null) {
            List<Relation> relations = relationRepository.getRelations(layer.getId());
            layer.setRelations(relations);
            layer.setHasRelations(!relations.isEmpty());
        }

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
        List<Layer> layers = layerRepository.getReferencingLayers(Integer.parseInt(layerId), userGroups);
        for (Layer l : layers) {
            List<Relation> relations = relationRepository.getRelations(l.getId());
            l.setRelations(relations);
            l.setHasRelations(!relations.isEmpty());
        }
        return layers;
    }
}
