package fi.sitowise.ksr.domain.esri;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;

import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * A POJO representing a single Feature in FeatureService REST API.
 */
public class Feature {

    public static class Builder {
        private Feature feature;

        public Builder() {
            this.feature = new Feature();
        }

        public Builder withParameter(String key, Object value) {
            this.feature.putAttributeValue(key, value);
            return this;
        }

        public Feature build() {
            return this.feature;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Object geometry;
    private Map<String, Object> attributes = new HashMap<>();

    /**
     * Get Features Geometry Object.
     *
     * @return Geometry object.
     */
    public Object getGeometry() {
        return geometry;
    }

    /**
     * Set Features Geometry Object.
     *
     * @param geometry Geometry object.
     */
    public void setGeometry(Object geometry) {
        this.geometry = geometry;
    }

    /**
     * Get Features attributes.
     *
     * @return Features attributes.
     */
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    /**
     * Set Map of Features attributes.
     *
     * @param attributes Features attributes.
     */
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    /**
     * Put or replace one value in Features attributes-Map.
     *
     * @param key Attribute key
     * @param value Attribute value
     */
    public void putAttributeValue(String key, Object value) {
        attributes.put(key, value);
    }

    /**
     * Get attribute value for given key.
     *
     * @param key Key of the attribute.
     * @return Value of the attribute if any, otherwise null.
     */
    public Object getAttributeValue(String key) {
        return this.attributes != null ? this.attributes.get(key) : null;
    }

    /**
     * Serialize EditFeature into JSON-array.
     *
     * JSON-array because FeatureService -rest api expects updates or adds to be an array of objects.
     *
     * @return EditFeature as a JSON-array.
     * @throws JsonProcessingException Exception thrown if JSON-serialization fails.
     */
    private String toJson() throws JsonProcessingException {
        ObjectMapper om = new ObjectMapper();
        return om.writeValueAsString(Collections.singletonList(this));
    }

    /**
     * Return EditFeature converted into HTTP-request compliant HttpEntity, containing named
     * parameters accepted by FeatureService.
     *
     * @param editType Action type.
     * @return Entity with params.
     * @throws JsonProcessingException Exception thrown if JSON-serialization fails.
     */
    public HttpEntity toParams(EditType editType) throws JsonProcessingException {
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "json"));
        String type;
        switch (editType) {
            case ADD:
                type = "adds";
                break;
            case UPDATE:
                type = "updates";
                break;
            default:
                throw new IllegalArgumentException("Invalid editType supplied.");
        }
        params.add(new BasicNameValuePair(type, this.toJson()));
        return new UrlEncodedFormEntity(params, StandardCharsets.UTF_8);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof Feature)) {
            return false;
        }

        Feature f = (Feature) o;

        return Objects.equals(f.attributes, attributes) && Objects.equals(f.geometry, geometry);
    }
}
