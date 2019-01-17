package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.contract.ContractLayer;
import fi.sitowise.ksr.domain.esri.Response;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.ContractService;
import fi.sitowise.ksr.service.LayerService;
import fi.sitowise.ksr.utils.KsrAuthenticationUtils;
import io.swagger.annotations.ApiOperation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller to query contracts.
 */
@RestController
@RequestMapping("/api/contract")
public class ContractController {
    private static final Logger LOG = LogManager.getLogger(ContractController.class);
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
    @ApiOperation("Gets contracts for given feature on given layer.")
    @GetMapping(value = "/{layerId}/{objectId}")
    public Response getContracts(@PathVariable int layerId, @PathVariable int objectId) {
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
    @ApiOperation("Get the layer that given layer is relating to.")
    @GetMapping(value = "/{layerId}")
    public Layer getRelatingLayer(@PathVariable int layerId) {
        Layer layer = layerService.getLayer(layerId, true, LayerAction.READ_LAYER);
        if (layer == null || !layer.isHasRelations()) {
            throw new KsrApiException.NotFoundErrorException("No layer can be found");
        }
        return this.contractService.getRelatingLayer(layer);
    }

    /**
     * Link to objects from two distinct layers.
     *
     * Linking is possible if layers are related and user has permission to modify required layers.
     *
     * @param fromLayerId Id of the layer whose object to relate.
     * @param fromObjectId Id of the object to relate.
     * @param toLayerId Id of the layer in which to relate.
     * @param toObjectId Id of the object in which to relate.
     */
    @ApiOperation("Link to objects from two distinct layers.")
    @GetMapping(value = "/link/{fromLayerId}/{fromObjectId}/{toLayerId}/{toObjectId}")
    public boolean link(
            @PathVariable int fromLayerId,
            @PathVariable int fromObjectId,
            @PathVariable int toLayerId,
            @PathVariable int toObjectId
    ) {
        Layer fromLayer = layerService.getLayer(fromLayerId, true, LayerAction.READ_LAYER);
        Layer toLayer = layerService.getLayer(toLayerId, true, LayerAction.READ_LAYER);
        if (fromLayer == null || toLayer == null) {
            LOG.info(
                    String.format(
                            "Cannot link contracts. Layer [%d] not found for user [%s].",
                            fromLayer == null ? fromLayerId : toLayerId,
                            KsrAuthenticationUtils.getCurrentUsername()
                    )
            );
            throw new KsrApiException.NotFoundErrorException(
                    String.format("Layer %d not found.", fromLayer == null ? fromLayerId : toLayerId)
            );
        } else if (!fromLayer.isHasRelations()) {
            LOG.info(
                    String.format(
                            "Cannot link contracts. Layer [%d] has not relations. User [%s].",
                            fromLayerId,
                            KsrAuthenticationUtils.getCurrentUsername()
                    )
            );
            throw new KsrApiException.NotFoundErrorException(String.format("Layer %d not linkable.", fromLayerId));
        }
        return contractService.linkObjects(fromLayer, fromObjectId, toLayer, toObjectId);
    }

    /**
     * Gets all features that relate to given feature on given layer.
     *
     * @param layerId Id of the layer.
     * @param objectId Id of the object, whose contracts to query.
     * @return Related Layers with features.
     */
    @ApiOperation("Gets all features that relate to given feature on given layer.")
    @GetMapping(value = "/details/{layerId}/{objectId}")
    public List<ContractLayer> getContractDetails(@PathVariable int layerId, @PathVariable int objectId) {
        Layer layer = layerService.getLayer(layerId, true, LayerAction.READ_LAYER);
        if (layer == null) {
            throw new KsrApiException.NotFoundErrorException("No layer can be found.");
        }
        return this.contractService.getContractDetails(layer, objectId);
    }

}
