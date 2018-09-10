package fi.sitowise.ksr.domain;

import java.io.Serializable;

/**
 * POJO representing a feature.
 */
public class Feature implements Serializable {
    private String id;
    private boolean highlight;

    /**
     * Constructs Feature object.
     */
    public Feature() {

    }

    /**
     * Constructs Feature object.
     */
    public Feature(String id, String highlight) {
        setId(id);
        setHighlight(highlight);
    }

    /**
     * @return feature's id
     */
    public String getId() {
        return id;
    }

    /**
     * Set feature id.
     *
     * @param id id of the feature
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return whether the feature is highlighted or not
     */
    public boolean isHighlight() {
        return highlight;
    }

    /**
     * Set feature's highlight status.
     *
     * @param highlight whether the feature is highlighted or not
     */
    public void setHighlight(String highlight) {
        this.highlight = "1".equals(highlight);
    }
}
