package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.repository.LayerRepository;
import fi.sitowise.ksr.repository.UserLayerRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Layer service.
 */
@Service
public class LayerService {

    private final LayerGroupService layerGroupService;

    private final LayerRepository layerRepository;
    private final UserLayerRepository userLayerRepository;

    /**
     * Instantiates a new Layer service.
     *
     * @param layerGroupService the layer group service
     * @param layerRepository   the layer repository
     */
    public LayerService(LayerGroupService layerGroupService, LayerRepository layerRepository, UserLayerRepository userLayerRepository) {
        this.layerGroupService = layerGroupService;
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
        List<String> userGroups = layerGroupService.getUserGroups();
        if (userGroups == null) {
            return null;
        }
        if (layerRepository.getLayer(id, userGroups, isQuery, actionType) == null) {
            return userLayerRepository.getUserLayer(id);
        }
        return layerRepository.getLayer(id, userGroups, isQuery, actionType);
    }
}
