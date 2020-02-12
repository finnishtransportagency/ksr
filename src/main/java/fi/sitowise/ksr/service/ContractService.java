package fi.sitowise.ksr.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.contract.ContractLayer;
import fi.sitowise.ksr.domain.esri.*;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.utils.EsriUtils;
import fi.sitowise.ksr.utils.KsrAuthenticationUtils;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import static fi.sitowise.ksr.utils.EsriUtils.createBasicQueryParams;
import static fi.sitowise.ksr.utils.EsriUtils.createUrl;
import static java.lang.Math.toIntExact;

/**
 * A service for fetching contracts for related records.
 */
@Service
public class ContractService {
    private static final Logger LOG = LogManager.getLogger(ContractService.class);
    private final HttpRequestService httpRequestService;
    private final LayerService layerService;

    @Autowired
    public ContractService(HttpRequestService httpRequestService, LayerService layerService) {
        this.httpRequestService = httpRequestService;
        this.layerService = layerService;
    }

    /**
     * Gets contracts for feature on given layer and id.
     *
     * @param layer Layer in which the feature belongs to.
     * @param objectId Id of the feature, whose contracts to look for.
     * @return Contracts for given feature.
     */
    public Response getContracts(Layer layer, int objectId) {
        switch (layer.getRelationType()) {
            case "one":
                return getRelationsSimple(layer, objectId);
            case "many":
                return getRelationsMany(layer, objectId);
            default:
                throw new KsrApiException.InternalServerErrorException(
                        String.format("Invalid relation type on layer: [%s]", layer.getId())
                );
        }
    }

    /**
     * Get contracts for feature, if relation type is many-to-many.
     *
     * @param layer Layer in which the feature belongs to.
     * @param objectId Id of the feature, whose contracts to look for.
     * @return Contracts for given feature.
     */
    private Response getRelationsMany(Layer layer, int objectId) {
        Response relationFeatures = getRelationsSimple(layer, objectId);
        Layer targetLayer = getTargetLayer(layer).getRelationType().equals("many") 
                ? layer
                : getTargetLayer(layer);

        List<Object> fkeys = relationFeatures.getAttributeValues(targetLayer.getRelationColumnOut());
        return getTargetFeatures(targetLayer, fkeys);
    }

    /**
     * Get contracts for feature, if relation type is one-to-many.
     *
     * @param layer Layer in which the feature belongs to.
     * @param objectId Id of the feature, whose contracts to look for.
     * @return Contracts for given feature.
     */
    private Response getRelationsSimple(Layer layer, int objectId) {
        List<Object> fkeys = getRelations(layer, objectId);
        return getTargetFeatures(layer, fkeys);
    }

    /**
     * Get target/contract -layer for layer. Target/contract -layer is defined
     * in layers contractLayerId -property.
     *
     * @param layer Layer whose target/contract -layer to get.
     * @return Target/contract -layer if found.
     */
    private Layer getTargetLayer(Layer layer) {
        return layerService.getLayer(
                toIntExact(layer.getRelationLayerId()),
                true,
                LayerAction.READ_LAYER
        );
    }

    /**
     * Get matching features from layers target-layer using foreign keys defined in fkeys-List.
     *
     * @param layer Layer whose target/contract -layer to use for querying target features.
     * @param fkeys List of foreign keys.
     * @return Matching features.
     */
    private Response getTargetFeatures(Layer layer, List<Object> fkeys) {
        Layer targetLayer = getTargetLayer(layer);

        if (targetLayer == null) {
            throw new KsrApiException.ForbiddenException("No contract-layer can be found.");
        }

        String url = createGetFeaturesUrl(targetLayer.getUrl(), layer.getRelationColumnIn(), fkeys);
        InputStream is = httpRequestService.getURLContents(url, layer.getUseInternalProxy(), null);
        return Response.fromInputStream(is, targetLayer.getId());
    }

    /**
     * Get Features (objects), from referencing layer, whose relation columns value equals with any of
     * expectedValues.
     *
     * For layers with relation of type "one" or "many" does a simple query.
     * For layers with relation of type "link" first finds layers that reference to refLayer and then call this
     * method again (recursively).
     *
     *
     * @param layer Layer which to query.
     * @param expectedValue Value to use in search.
     * @return List of ContractLayers with matching features.
     */
    private List<ContractLayer> getReferencingLayerFeatures(Layer layer, Object expectedValue) {
        Optional<String> getFeaturesUrl = layer.getGetFeaturesUrl(layer.getRelationColumnOut(), expectedValue);
        if (getFeaturesUrl.isPresent()) {
            String url = getFeaturesUrl.get();
            InputStream is = httpRequestService.getURLContents(url, layer.getUseInternalProxy(), layer.getAuthentication());
            Response res = Response.fromInputStream(is, layer.getId());
            switch (layer.getRelationType()) {
                case "one":
                case "many":
                    return Collections.singletonList(new ContractLayer(layer, res));
                case "link":
                    List<Layer> refLayers = layerService.getReferencingLayers(layer.getId());
                    return refLayers.stream()
                            .map(refLayer -> {
                                List<Object> newExpectedValues = res.getAttributeValues(refLayer.getRelationColumnIn());
                                return getReferencingLayerFeatures(refLayer, newExpectedValues);
                            })
                            .flatMap(List::stream)
                            .collect(Collectors.toList());
                default:
                    return Collections.emptyList();
            }
        }
        return Collections.emptyList();
    }

    /**
     * Get layers that reference to given layers.
     *
     * @param layer Layer whose references to find.
     * @return List of ContractLayers with queried features.
     */
    private List<ContractLayer> getReferencingLayers(Layer layer, Feature feature) {
        List<Layer> refLayers = layerService.getReferencingLayers(layer.getId());
        return refLayers.stream()
                .map(refLayer -> {
                    Object expectedValue = feature.getAttributeValue(refLayer.getRelationColumnIn());
                    return getReferencingLayerFeatures(refLayer, expectedValue);
                })
                .flatMap(List::stream)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Get relations for feature on given layer.
     *
     * @param layer Layer in which the feature belongs to.
     * @param objectID Id of the feature, whose relations to look for.
     * @return Contract numbers for feature.
     */
    private List<Object> getRelations(Layer layer, int objectID) {
        String url = createGetRelationUrl(layer, objectID);
        InputStream is = httpRequestService.getURLContents(url, layer.getUseInternalProxy(), layer.getAuthentication());
        Response eQRes = Response.fromInputStream(is, layer.getId());
        return eQRes.getAttributeValues(layer.getRelationColumnOut());
    }

    /**
     * A shorthand method to get a single record with objectId.
     *
     * @param layer Layer to search contract from.
     * @param objectID OBJECTID of the contract.
     * @return Esri JSON response.
     */
    private QueryFeature getWithObjectId(Layer layer, int objectID) {
        return layer.getGetWithObjectIdUrl(objectID)
            .map(url -> {
                InputStream is = httpRequestService.getURLContents(
                        url,
                        layer.getUseInternalProxy(),
                        layer.getAuthentication()
                );
                return QueryFeature.fromInputStream(is);
            })
            .orElseThrow(() -> new KsrApiException.InternalServerErrorException(
                    String.format("Cannot query non agfs-layer: [%s].", layer.getId())
            ));
    }

    /**
     * Creates an query-url with a WHERE IN -filter compliant with ArcGIS Feature Service.
     *
     * @param layerUrl Layer url.
     * @param columnName Name of the filter column.
     * @param fkeys List of foreign keys.
     * @return Query-url compliant with ArcGIS Feature Service.
     */
    private String createGetFeaturesUrl(String layerUrl, String columnName, List<Object> fkeys) {
        List<NameValuePair> params = createBasicQueryParams("*");
        params.add(new BasicNameValuePair(
                "where",
                String.format("%s IN (%s)", columnName, KsrStringUtils.toString(fkeys))
        ));

        return createUrl(layerUrl, params);
    }

    /**
     * Creates an query-url with a WHERE objectIds -filter compliant with ArcGIS Feature Service.
     *
     * @param layer Layer to query.
     * @param objectID ObjectID to use in filter.
     * @return Query-url compliant with ArcGIS Feature Service.
     */
    private String createGetRelationUrl(Layer layer, int objectID) {
        List<NameValuePair> params = createBasicQueryParams(layer.getRelationColumnOut());
        params.add(new BasicNameValuePair("objectIds", Integer.toString(objectID)));
        return createUrl(layer.getUrl(), params);
    }

    /**
     * Find all referencing layers for a layer, and for those layers query features that have
     * some relation to given object (objectId). Also returns the object from the given layer itself.
     *
     * @param layer Layer whose references to find.
     * @param objectId Id of the object whose related records to find.
     * @return List of layers that conform method description.
     */
    public List<ContractLayer> getContractDetails(Layer layer, int objectId) {
        List<ContractLayer> res = new ArrayList<>();
        QueryFeature queryFeature = getWithObjectId(layer, objectId);
        res.add(new ContractLayer(layer, queryFeature));
        res.addAll(getReferencingLayers(layer, queryFeature.getFeature()));
        return res;
    }

    /**
     * Find layer that the given layer has relation to.
     *
     * @param layer Layer that is relating to another layer.
     * @return Found target layer.
     */
    public Layer getRelatingLayer(Layer layer) {
        if (layer == null || layer.getRelationType() == null) {
            throw new KsrApiException.NotFoundErrorException("Layer has no target layers.");
        }
        switch (layer.getRelationType()) {
            case "many":
                return getRelatingLayer(getTargetLayer(layer));
            case "link":
            case "one":
                return getTargetLayer(layer);
            default:
                throw new KsrApiException.NotFoundErrorException("Layer has no target layers.");
        }
    }

    /**
     * Return "objectIdField" -for layer.
     *
     * The value is taken from layerdefinition available from FeatureService REST API.
     *
     * @param layer Layer whose definition to use.
     * @return Layer's objectIdField or if not found an expection is thrown.
     */
    private String getObjectIdFieldName(Layer layer) {
        String url = layer.getLayerDefitionUrl().orElseThrow(() ->
                new KsrApiException.InternalServerErrorException(
                        String.format("Cannot get layerdefinition for layer: [%s].", layer.getId())
                )
        );
        InputStream is = httpRequestService.getURLContents(url, layer.getUseInternalProxy(), layer.getAuthentication());
        return EsriUtils.getLayerDefinitionValue(is, "objectIdField")
                .map(value -> {
                    if (value instanceof String) {
                        return (String) value;
                    }
                    throw new KsrApiException.InternalServerErrorException(
                            String.format("Unexpected objectIdField for layer: [%s].", layer.getId())
                    );
                }).orElseThrow(() -> new KsrApiException.InternalServerErrorException(
                        String.format("Cannot read layerdefinition for layer: [%s].", layer.getId())
                ));
    }

    /**
     * Edits a feature with objectId on given layer using ArcGIS FeatureService REST API.
     *
     * @param layer Layer to add feature.
     * @param objectId ObjectId of the feature to edit.
     * @param value Value for field of name taken from layer.getRelationColumnOut().
     * @return FeatureService REST API response.
     */
    private EditResponse handleUpdate(Layer layer, int objectId, Object value) {
        String objectIdField = getObjectIdFieldName(layer);
        Feature.Builder featBuilder = new Feature.Builder()
                .withParameter(objectIdField, objectId)
                .withParameter(layer.getRelationColumnOut(), value);
        if (layer.getUpdaterField() != null && !layer.getUpdaterField().isEmpty()) {
            featBuilder.withParameter(layer.getUpdaterField(), KsrAuthenticationUtils.getCurrentUserUpdaterName());
        }
        try {
            String url = layer.getApplyEditsUrl()
                    .orElseThrow(() -> new KsrApiException
                            .InternalServerErrorException(
                                    String.format("Cannot create applyEdits-url for layer: [%s]", layer.getId())
                    ));
            InputStream is = httpRequestService.postURLContents(
                    url,
                    featBuilder.build().toParams(EditType.UPDATE),
                    layer.getAuthentication(),
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE,
                    layer.getUseInternalProxy());
            return EditResponse.fromInputStream(is);
        } catch (JsonProcessingException e) {
            throw new KsrApiException.InternalServerErrorException("Error during linkage.", e);
        }

    }

    /**
     * Adds a feature constructed from arguments into layer using ArcGIS FeatureService REST API.
     *
     * @param layer Layer to add feature.
     * @param inField Field name for inValue.
     * @param inValue Value for field inField.
     * @param outValue Value for field of name taken from layer.getRelationColumnOut().
     * @return FeatureService REST API response.
     */
    private EditResponse handleAdd(Layer layer, String inField, Object inValue, Object outValue) {
        Feature.Builder featBuilder = new Feature.Builder()
                .withParameter(layer.getRelationColumnOut(), outValue)
                .withParameter(inField, inValue);
        if (layer.getUpdaterField() != null) {
            featBuilder.withParameter(layer.getUpdaterField(), KsrAuthenticationUtils.getCurrentUserUpdaterName());
        }
        Feature feat = featBuilder.build();
        String url = layer.getApplyEditsUrl()
                .orElseThrow(() -> new KsrApiException
                        .InternalServerErrorException(
                        String.format("Cannot create applyEdits-url for layer: [%s]", layer.getId())
                ));
        try {
            InputStream is = httpRequestService.postURLContents(
                    url,
                    feat.toParams(EditType.ADD),
                    layer.getAuthentication(),
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE,
                    layer.getUseInternalProxy());
            return EditResponse.fromInputStream(is);

        } catch (JsonProcessingException e) {
            throw new KsrApiException.InternalServerErrorException("Error during ");
        }
    }

    /**
     * Deletes a feature from layer's target layer.
     *
     * @param layer Layer which target layer to delete features from.
     * @param inValue Value for column defined in layer.relationColumnIn().
     * @param outValue Value for column defined in target layers relationColumnOut().
     */
    private void handleDelete(Layer layer, Object inValue, Object outValue) {
        Layer linkLayer = getTargetLayer(layer);
        Response res = getTargetFeatures(layer, Collections.singletonList(inValue));
        String objectIds = res.getFeatures()
                .stream()
                .filter(f -> Objects.equals(f.getAttributeValue(linkLayer.getRelationColumnOut()), outValue))
                .map(f -> f.getAttributeValue(res.getObjectIdFieldName()).toString())
                .collect(Collectors.joining(","));

        String baseUrl = linkLayer.getDeleteFeaturesUrl()
                .orElseThrow(() -> new KsrApiException
                        .InternalServerErrorException(
                                String.format("Cannot create deleteFeatures-url for layer: [%s]", layer.getId())
                ));

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "json"));
        params.add(new BasicNameValuePair("objectIds", objectIds));
        HttpEntity entity = new UrlEncodedFormEntity(params, StandardCharsets.UTF_8);

        httpRequestService.postURLContents(
                baseUrl,
                entity,
                linkLayer.getAuthentication(),
                MediaType.APPLICATION_FORM_URLENCODED_VALUE,
                linkLayer.getUseInternalProxy()
        );
    }

    /**
     * Link two objects connected with one to many relation.
     *
     * @param fromLayer Id of the layer where fromObjectId is in.
     * @param fromObjectId ObjectId of the feature to link.
     * @param toLayer Id of the layer where toObjectId is in.
     * @param toObjectId ObjectId of the feature the link leads.
     * @return False. Indicates that nothing new was created, but existing feature was updated.
     */
    private boolean linkSimple(Layer fromLayer, int fromObjectId, Layer toLayer, int toObjectId) {
        QueryFeature queryFeature = getWithObjectId(toLayer, toObjectId);
        Object value = queryFeature.getFeature().getAttributeValue(fromLayer.getRelationColumnIn());
        if (handleUpdate(fromLayer, fromObjectId, value).hasUpdateSuccess()) {
            return false;
        }
        throw new KsrApiException.BadRequestException("Error linking objects. FeatureService returned false success.");
    }

    /**
     * Check if similar feature already exists on target layer.
     *
     * Throws a BadRequestException if layer is not agfs or agfl -layer and thus not queryable.
     *
     * @param layer Layer whose target to search.
     * @param filterValue Value to use in filter.
     * @param requiredValue Value to search from filtered features. If any matches, then feature exists.
     * @return Boolean indicating if feature already exists.BadRequestException
     */
    private boolean existsOnTarget(Layer layer, Object filterValue, Object requiredValue) {
        Response res = getTargetFeatures(layer, Collections.singletonList(filterValue));
        Layer targetLayer = getTargetLayer(layer);
        return res.hasValue(targetLayer.getRelationColumnOut(), requiredValue);
    }

    /**
     * Link or unlink two objects connected with many to many relation.
     *
     * @param fromLayer Id of the layer where fromObjectId is in.
     * @param fromObjectId ObjectId of the feature to link or unlink.
     * @param toLayer Id of the layer where toObjectId is in.
     * @param toObjectId ObjectId of the feature the link leads.
     * @param isUnlink Boolean indicating that unlink instead of linking.
     * @return True if something was created, false if nothing was created because feature already exists.
     */
    private boolean linkMany(Layer fromLayer, int fromObjectId, Layer toLayer, int toObjectId, boolean isUnlink) {
        Layer linkLayer = getTargetLayer(fromLayer);
        if (
            linkLayer.getRelationLayerId() != null
            && linkLayer.getRelationLayerId().toString().equals(toLayer.getId())
            && linkLayer.getLayerPermission().isUpdateLayer()
            ) {
            // Ensures that there is only one link-layer between tables.
            QueryFeature fromRes = getWithObjectId(fromLayer, fromObjectId);
            Object fromValue = fromRes.getFeature().getAttributeValue(fromLayer.getRelationColumnOut());

            QueryFeature toRes = getWithObjectId(toLayer, toObjectId);
            Object toValue = toRes.getFeature().getAttributeValue(linkLayer.getRelationColumnIn());
            if (existsOnTarget(fromLayer, fromValue, toValue)) {
                if (isUnlink) {
                    // Unlink here
                    handleDelete(fromLayer, fromValue, toValue);
                }
                return false;
            } else if (!isUnlink && handleAdd(linkLayer, fromLayer.getRelationColumnIn(), fromValue, toValue).hasAddSuccess()) {
                return true;
            }
            throw new KsrApiException.BadRequestException("Error linking objects. FeatureService returned false success.");

        } else if (!linkLayer.getLayerPermission().isUpdateLayer()) {
            LOG.info(
                    String.format(
                            "User: [%s] tried to edit layer: [%s] without permission.",
                            KsrAuthenticationUtils.getCurrentUsername(),
                            fromLayer.getId()
                    )
            );
            throw new KsrApiException.ForbiddenException("No edit-permission for layer.");
        } else {
            LOG.info(String.format("No link between layers: [%s] - [%s]", fromLayer.getId(), toLayer.getId()));
            throw new KsrApiException.ForbiddenException("No link between layers.");
        }
    }

    /**
     * A helper / utility to check that user has update permission, and if not throw a 403.
     *
     * @param layer Layer whose permission to check.
     */
    private void ensureUpdatePermission(Layer layer) {
        if (layer.getLayerPermission() == null || !layer.getLayerPermission().isUpdateLayer()) {
            LOG.info(
                    String.format(
                            "User: [%s] tried to edit layer: [%s] without permission.",
                            KsrAuthenticationUtils.getCurrentUsername(),
                            layer.getId()
                    )
            );
            throw new KsrApiException.ForbiddenException("No edit-permission for layer.");
        }
    }

    /**
     * Unlink two objects connected with simple relation.
     *
     * In this case, unlinking basically means that the value of relation column out is set to NULL.
     *
     * @param fromLayer Layer to unlink.
     * @param fromObjectId Id of the object to unlink.
     */
    private void unlinkSimple(Layer fromLayer, int fromObjectId) {
        if (handleUpdate(fromLayer, fromObjectId, null).hasUpdateSuccess()) {
            return;
        }
        throw new KsrApiException.BadRequestException("Error linking objects. FeatureService returned false success.");
    }

    /**
     * Links two objects, if there is a connection.
     *
     * @param fromLayer Id of the layer where fromObjectId is in.
     * @param fromObjectId ObjectId of the feature to link.
     * @param toLayer Id of the layer where toObjectId is in.
     * @param toObjectId ObjectId of the feature the link leads.
     * @return True if something was created, false if nothing was created because feature already exists.
     */
    public boolean linkObjects(Layer fromLayer, int fromObjectId, Layer toLayer, int toObjectId) {
        if (
                fromLayer.getRelationLayerId() != null
                && fromLayer.getRelationLayerId().toString().equals(toLayer.getId())
                && "one".equals(fromLayer.getRelationType())
            ) {
            ensureUpdatePermission(fromLayer);
            return linkSimple(fromLayer, fromObjectId, toLayer, toObjectId);

        } else if (
                fromLayer.getRelationLayerId() != null
                && "many".equals(fromLayer.getRelationType())
                ) {
            return linkMany(fromLayer, fromObjectId, toLayer, toObjectId, false);
        } else {
            throw new KsrApiException.BadRequestException("Layers are not linkable.");
        }
    }

    /**
     * Unlink objects if connected.
     *
     * Works for both simple- and many -relations.
     *
     * @param fromLayer Id of the layer where fromObjectId is in.
     * @param fromObjectId ObjectId of the feature to unlink.
     * @param toLayer Id of the layer where toObjectId is in.
     * @param toObjectId ObjectId of the feature the link leads.
     */
    public void unlinkObjects(Layer fromLayer, int fromObjectId, Layer toLayer, int toObjectId) {
        if (
                fromLayer.getRelationLayerId() != null
                        && fromLayer.getRelationLayerId().toString().equals(toLayer.getId())
                        && "one".equals(fromLayer.getRelationType())
        ) {
            ensureUpdatePermission(fromLayer);
            unlinkSimple(fromLayer, fromObjectId);
        } else if (
                fromLayer.getRelationLayerId() != null
                        && "many".equals(fromLayer.getRelationType())
        ) {
            linkMany(fromLayer, fromObjectId, toLayer, toObjectId, true);
        } else {
            throw new KsrApiException.BadRequestException("Layers are not linkable.");
        }
    }
}
