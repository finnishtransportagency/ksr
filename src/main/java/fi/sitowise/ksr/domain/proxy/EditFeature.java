package fi.sitowise.ksr.domain.proxy;

import java.util.Map;

public class EditFeature {
    private Object geometry;
    private Map<String, Object> attributes;

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
    public void putAttributeValue(String key, String value) {
        attributes.put(key, value);
    }
}
