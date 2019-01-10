package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.contract.ContractLayer;
import fi.sitowise.ksr.domain.proxy.EsriQueryResponse;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.ContractService;
import fi.sitowise.ksr.service.LayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller to query contracts.
 */
@RestController
@RequestMapping("/api/contract")
public class ContractController {

    private final LayerService layerService;
    private final ContractService contractService;

    @Autowired
    private ContractController(LayerService layerService, ContractService contractService) {
        this.layerService = layerService;
        this.contractService = contractService;
    }

    /**
     * Gets contracts for given feature on given layer.
     *
     * @param layerId Id of the layer.
     * @param objectId Id of the object, whose contracts to query.
     * @return Contracts if any.
     */
    @RequestMapping(value = "/{layerId}/{objectId}", method = { RequestMethod.GET })
    public EsriQueryResponse getContracts(@PathVariable int layerId, @PathVariable int objectId) {
        Layer layer = layerService.getLayer(layerId, true, LayerAction.READ_LAYER);
        if (layer == null || !layer.isHasRelations()) {
            throw new KsrApiException.NotFoundErrorException("No Layer can be found.");
        }
        return this.contractService.getContracts(layer, objectId);
    }

    /**
     * Get the layer that given layer is relating to.
     *
     * @param layerId Id of the layer.
     * @return Layer that the layer is relating to.
     */
    @RequestMapping(value = "/{layerId}", method = { RequestMethod.GET })
    public Layer getRelatingLayer(@PathVariable int layerId) {
        Layer layer = layerService.getLayer(layerId, true, LayerAction.READ_LAYER);
        if (layer == null || !layer.isHasRelations()) {
            throw new KsrApiException.NotFoundErrorException("No layer can be found");
        }
        return this.contractService.getRelatingLayer(layer);
    }

    /**
     * Gets all features that relate to given feature on given layer.
     *
     * @param layerId Id of the layer.
     * @param objectId Id of the object, whose contracts to query.
     * @return Related Layers with features.
     */
    @RequestMapping(value = "/details/{layerId}/{objectId}", method = { RequestMethod.GET })
    public List<ContractLayer> getContractDetails(@PathVariable int layerId, @PathVariable int objectId) {
        Layer layer = layerService.getLayer(layerId, true, LayerAction.READ_LAYER);
        if (layer == null) {
            throw new KsrApiException.NotFoundErrorException("No layer can be found.");
        }
        return this.contractService.getContractDetails(layer, objectId);
    }

}
