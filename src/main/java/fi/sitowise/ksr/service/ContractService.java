package fi.sitowise.ksr.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.domain.proxy.EsriQueryResponse;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.lang.Math.toIntExact;

/**
 * A service for fetching contracts for related records.
 */
@Service
public class ContractService {
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
    public EsriQueryResponse getContracts(Layer layer, int objectId) {
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
    private EsriQueryResponse getRelationsMany(Layer layer, int objectId) {
        EsriQueryResponse relationFeatures = getRelationsSimple(layer, objectId);
        Layer targetLayer = getTargetLayer(layer);
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
    private EsriQueryResponse getRelationsSimple(Layer layer, int objectId) {
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
    private EsriQueryResponse getTargetFeatures(Layer layer, List<Object> fkeys) {
        Layer targetLayer = getTargetLayer(layer);

        if (targetLayer == null) {
            throw new KsrApiException.ForbiddenException("No contract-layer can be found.");
        }

        String url = createGetFeaturesUrl(targetLayer, fkeys);
        InputStream is = httpRequestService.getURLContents(url, layer.getUseInternalProxy(), null);
        return deSerializeResponse(is, targetLayer.getId());
    }

    /**
     * Join List of parameters with comma.
     * Parameters of type Integer are not escaped with single quotes.
     * Parameters of any other type are escaped with single quotes.
     *
     * @param filterParams List of parameters.
     * @return String of parameters separated with comma.
     */
    private String joinFilterParams(List<Object> filterParams) {
        return filterParams.stream().map(p -> {
            if (p == null) { return null; }

            switch(p.getClass().getName()) {
                case "java.lang.Integer":
                    return Integer.toString((Integer) p);
                default:
                    return String.format("'%s'", p.toString());
            }
        }).filter(Objects::nonNull).collect(Collectors.joining(","));
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
        InputStream is = httpRequestService.getURLContents(url, layer.getUseInternalProxy(), null);
        EsriQueryResponse eQRes = deSerializeResponse(is, layer.getId());
        return eQRes.getAttributeValues(layer.getRelationColumnOut());
    }

    /**
     * Deserializes responses InputStream into an EsriQueryResponse -object.
     *
     * @param is InputStream to deserialize.
     * @param layerId Id of the corresponding layer. Only used for logging purposes.
     * @return EsriQueryResponse -object.
     */
    private EsriQueryResponse deSerializeResponse(InputStream is, String layerId) {
        ObjectMapper om = new ObjectMapper();
        try {
            return om.readValue(is, EsriQueryResponse.class);
        } catch (IOException e) {
            throw new KsrApiException.InternalServerErrorException(
                    String.format("Error deserializing response from FeatureService. Layer: [%S]", layerId),
                    e
            );
        }
    }

    /**
     * Creates an url from base-url and query-parameters.
     *
     * @param baseUrl Base-url. Adds query-parameters after the base-url.
     * @param params Query-parameters.
     * @return  Url as a combination of base-url and query-parameters.
     */
    private String createUrl(String baseUrl, List<NameValuePair> params) {
        try {
            URL url = new URL(baseUrl);

            URIBuilder builder = new URIBuilder();
            builder.setScheme(url.getProtocol());
            builder.setHost(url.getHost());
            builder.setPath(
                    KsrStringUtils.replaceMultipleSlashes(
                            String.format("%s/%s", url.getPath(), "query")
                    )
            );
            builder.setParameters(params);
            return builder.toString();

        } catch (MalformedURLException e) {
            throw new KsrApiException.InternalServerErrorException(
                    String.format("Error fetching contracts. Error reading layer-url. Url: [%s]", baseUrl),
                    e
            );
        }
    }

    /**
     * Creates an query-url with a WHERE IN -filter compliant with ArcGIS Feature Service.
     *
     * @param layer Layer to query.
     * @param fkeys List of foreign keys.
     * @return Query-url compliant with ArcGIS Feature Service.
     */
    private String createGetFeaturesUrl(Layer layer, List<Object> fkeys) {
        List<NameValuePair> params = createBasicQueryParams("*");
        params.add(new BasicNameValuePair(
                "where",
                String.format("%s IN (%s)", layer.getRelationColumnIn(), joinFilterParams(fkeys))
        ));

        return createUrl(layer.getUrl(), params);
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
     * A Helper method to create List of common query-parameters. Query-parameters are compatible with ArcGIS
     * Feature Service.
     *
     * @param outFields Names of the fields-to return. * (asterisk) means that all fields should be returned.
     * @return List of query-parameters.
     */
    private List<NameValuePair> createBasicQueryParams(String outFields) {
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "pjson"));
        params.add(new BasicNameValuePair("returnGeometry", "false"));
        params.add(new BasicNameValuePair("outFields", outFields));
        return params;
    }
}
