package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.repository.LayerRepository;
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

    /**
     * Instantiates a new Layer service.
     *
     * @param layerGroupService the layer group service
     * @param layerRepository   the layer repository
     */
    public LayerService(LayerGroupService layerGroupService, LayerRepository layerRepository) {
        this.layerGroupService = layerGroupService;
        this.layerRepository = layerRepository;
    }

    /**
     * Gets layer
     *
     * @param id the layer id
     * @return the layer
     */
    @Cacheable("get_layer")
    public Layer getLayer(int id) {
        List<String> userGroups = layerGroupService.getUserGroups();
        if (userGroups == null) {
            return null;
        }
        return layerRepository.getLayer(id, userGroups);
    }
}
