package fi.sitowise.ksr.domain.proxy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * A POJO for Esri ArcGIS Server Feature Service Query-response.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class EsriQueryResponse {
    private static final Logger log = LogManager.getLogger(EsriQueryResponse.class);

    private String objectIdFieldName;
    private String globalIdFieldName;
    private List<Map<String, String>> fields;
    private List<Map<String, Map<String, Object>>> features;

    /**
     * Gets Esri-JSON fields-attribute.
     *
     * @return Esri-JSON fields-attribute.
     */
    public List<Map<String, String>> getFields() {
        return fields;
    }

    /**
     * Sets Esri-JSON fields-attribute.
     *
     * @param fields Esri-JSON fields-attribute.
     */
    public void setFields(List<Map<String, String>> fields) {
        this.fields = fields;
    }

    /**
     * Gets Esri-JSON features-attribute.
     *
     * @return Esri-JSON features-attribute.
     */
    public List<Map<String, Map<String, Object>>> getFeatures() {
        return features;
    }

    /**
     * Sets Esri-JSON features-attribute.
     *
     * @param features Esri-JSON features-attribute.
     */
    public void setFeatures(List<Map<String, Map<String, Object>>> features) {
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
        return features.stream().map(a -> {
            Map<String, Object> attrs = null;
            try {
                attrs = a.get("attributes");
            } catch (ClassCastException e) {
                log.info("Error reading attribute-values from FeatureService response.", e);
            }
            return (attrs != null) ? attrs.get(fieldName) : null;
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof EsriQueryResponse)) {
            return false;
        }

        EsriQueryResponse e = (EsriQueryResponse) o;

        return e.globalIdFieldName.equals(globalIdFieldName) && e.objectIdFieldName.equals(objectIdFieldName)
                && e.features.equals(features) && e.fields.equals(fields);
    }
}
