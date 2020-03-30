package fi.sitowise.ksr.domain.esri;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import fi.sitowise.ksr.exceptions.KsrApiException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * A POJO for Esri ArcGIS Server Feature Service Query-response.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Response {
    private String layerId;
    private String objectIdFieldName;
    private String globalIdFieldName;
    private List<Map<String, Object>> fields;
    private List<Feature> features;


    /**
     * Get layer Id.
     *
     * @return Layer id.
     */
    public String getLayerId() {
        return layerId;
    }

    /**
     * Set Layer Id.
     *
     * @param layerId Id of layer.
     */
    public void setLayerId(String layerId) {
        this.layerId = layerId;
    }

    /**
     * Gets Esri-JSON fields-attribute.
     *
     * @return Esri-JSON fields-attribute.
     */
    public List<Map<String, Object>> getFields() {
        return fields;
    }

    /**
     * Sets Esri-JSON fields-attribute.
     *
     * @param fields Esri-JSON fields-attribute.
     */
    public void setFields(List<Map<String, Object>> fields) {
        this.fields = fields;
    }

    /**
     * Gets Esri-JSON features-attribute.
     *
     * @return Esri-JSON features-attribute.
     */
    public List<Feature> getFeatures() {
        return features;
    }

    /**
     * Sets Esri-JSON features-attribute.
     *
     * @param features Esri-JSON features-attribute.
     */
    public void setFeatures(List<Feature> features) {
        this.features = features;
    }

    /**
     * Gets Esri-JSON objectIdFieldName-attribute.
     *
     * @return Esri-JSON objectIdFieldName-attribute.
     */
    public String getObjectIdFieldName() {
        return objectIdFieldName;
    }

    /**
     * Sets Esri-JSON objectIdFieldName-attribute.
     *
     * @param objectIdFieldName Esri-JSON objectIdFieldName-attribute.
     */
    public void setObjectIdFieldName(String objectIdFieldName) {
        this.objectIdFieldName = objectIdFieldName;
    }

    /**
     * Gets Esri-JSON globalIdFieldName-attribute.
     *
     * @return Esri-JSON globalIdFieldName-attribute.
     */
    public String getGlobalIdFieldName() {
        return globalIdFieldName;
    }

    /**
     * Sets Esri-JSON globalIdFieldName-attribute.
     *
     * @param globalIdFieldName Esri-JSON globalIdFieldName-attribute.
     */
    public void setGlobalIdFieldName(String globalIdFieldName) {
        this.globalIdFieldName = globalIdFieldName;
    }

    /**
     * Gets List of attribute-values for given fieldName.
     *
     * @param fieldName Name of the attribute field.
     * @return List of attribute-values for given fieldName.
     */
    public List<Object> getAttributeValues(String fieldName) {
        if (features == null) { return Collections.emptyList(); }
        return features.stream()
                .map(feature -> feature.getAttributeValue(fieldName))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof Response)) {
            return false;
        }

        Response e = (Response) o;

        return e.globalIdFieldName.equals(globalIdFieldName) && e.objectIdFieldName.equals(objectIdFieldName)
                && e.features.equals(features) && e.fields.equals(fields);
    }

    /**
     * Deserializes responses InputStream into an EsriQueryResponse -object.
     *
     * @param is InputStream to deserialize.
     * @param layerId Id of the corresponding layer. Only used for logging purposes.
     * @return EsriQueryResponse -object.
     */
    public static Response fromInputStream(InputStream is, String layerId) {
        ObjectMapper om = new ObjectMapper();
        try {
            return om.readValue(is, Response.class);
        } catch (IOException e) {
            throw new KsrApiException.InternalServerErrorException(
                    String.format("Error de-serialising response from FeatureService. Layer: [%S]", layerId),
                    e
            );
        }
    }

    /**
     * Returns boolean if Response contains at least one feature on given column with given value.
     *
     * @param column Column to look value for.
     * @param value Value to search.
     * @return True if at least one matching feature exists. Otherwise false.
     */
    public boolean hasValue(String column, Object value) {
        if (this.features == null || this.features.isEmpty()) {
            return false;
        }
        return this.features.stream().anyMatch(f -> Objects.equals(f.getAttributeValue(column), value));
    }
}
