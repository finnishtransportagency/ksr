package fi.sitowise.ksr.domain;

import fi.sitowise.ksr.jooq.tables.records.LayerRecord;

import java.io.Serializable;
import java.math.BigDecimal;

import static java.lang.Math.toIntExact;

/**
 * A Layer-POJO which represents a map layer.
 */
public class Layer implements Serializable {
    private Integer id;
    private String name;
    private String type;
    private String url;
    private String layers;
    private String styles;
    private Boolean visible;
    private Double opacity;
    private String authentication;
    private Integer layerOrder;
    private Integer minScale;
    private Integer maxScale;
    private Boolean transparent;
    private String attribution;
    private Boolean desktopVisible;
    private Boolean mobileVisible;

    /**
     * Construct a Layer
     */
    public Layer() {}

    /**
     * Construct a Layer from jOOQ LayerRecord.
     *
     * @param lr LayerRecord
     */
    public Layer(LayerRecord lr) {
        this.setId(lr.getId());
        this.setName(lr.getName());
        this.setType(lr.getType());
        this.setUrl(lr.getUrl());
        this.setLayers(lr.getLayers());
        this.setStyles(lr.getStyles());
        this.setOpacity(lr.getOpacity());
        this.setAuthentication(lr.getAuthentication());
        this.setLayerOrder(lr.getLayerOrder());
        this.setMinScale(lr.getMinScale());
        this.setMaxScale(lr.getMaxScale());
        this.setTransparent(lr.getTransparent());
        this.setAttribution(lr.getAttribution());
        this.setDesktopVisible(lr.getDesktopVisible());
        this.setMobileVisible(lr.getMobileVisible());
    }

    /**
     * Get the id.
     *
     * @return id id
     */
    public Integer getId() {
        return id;
    }

    /**
     * Set the id.
     *
     * @param id id
     */
    public void setId(Long id) {
        this.id = toIntExact(id);
    }

    /**
     * Set the id.
     *
     * @param id id
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * Get the name.
     *
     * @return name name
     */
    public String getName() {
        return name;
    }

    /**
     * Set the name.
     *
     * @param name name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the type.
     *
     * @return type type
     */
    public String getType() {
        return type;
    }

    /**
     * Set the type.
     *
     * @param type type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * Get the url.
     *
     * @return url url
     */
    public String getUrl() {
        return url;
    }

    /**
     * Set the url.
     *
     * @param url url
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Get the layers.
     *
     * @return layers layers
     */
    public String getLayers() {
        return layers;
    }

    /**
     * Set the layers
     *
     * @param layers layers
     */
    public void setLayers(String layers) {
        this.layers = layers;
    }

    /**
     * Get the styles
     *
     * @return styles styles
     */
    public String getStyles() {
        return styles;
    }

    /**
     * Set the styles
     *
     * @param styles styles
     */
    public void setStyles(String styles) {
        this.styles = styles;
    }

    /**
     * Gets visible.
     *
     * @return the visible
     */
    public Boolean getVisible() {
        return visible;
    }

    /**
     * Sets visible.
     *
     * @param visible the visible
     */
    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    /**
     * Get the opacity.
     *
     * @return opacity opacity
     */
    public Double getOpacity() {
        return opacity;
    }

    /**
     * Set the opacity.
     *
     * @param opacity opacity
     */
    public void setOpacity(BigDecimal opacity) {
        this.opacity = opacity == null ? null : opacity.doubleValue();
    }

    /**
     * Set the opacity.
     *
     * @param opacity opacity
     */
    public void setOpacity(Double opacity) {
        this.opacity = opacity;
    }

    /**
     * Get the authentication.
     *
     * @return authentication authentication
     */
    public String getAuthentication() {
        return authentication;
    }

    /**
     * Set the authentication
     *
     * @param authentication authentication
     */
    public void setAuthentication(String authentication) {
        this.authentication = authentication;
    }

    /**
     * Get the layer order
     *
     * @return layer order
     */
    public Integer getLayerOrder() {
        return layerOrder;
    }

    /**
     * Set the layer order.
     *
     * @param layerOrder layer order
     */
    public void setLayerOrder(Integer layerOrder) {
        this.layerOrder = layerOrder;
    }

    /**
     * Get minimum scale.
     *
     * @return minimum scale
     */
    public Integer getMinScale() {
        return minScale;
    }

    /**
     * Set the minimum scale.
     *
     * @param minScale minimum scale
     */
    public void setMinScale(Integer minScale) {
        this.minScale = minScale;
    }

    /**
     * Get maximum scale.
     *
     * @return maximum scale
     */
    public Integer getMaxScale() {
        return maxScale;
    }

    /**
     * Set maximum scale.
     *
     * @param maxScale maximum scale
     */
    public void setMaxScale(Integer maxScale) {
        this.maxScale = maxScale;
    }

    /**
     * Get the transparent
     *
     * @return transparent transparent
     */
    public Boolean getTransparent() {
        return transparent;
    }

    /**
     * Set the transparent
     *
     * @param transparent transparent
     */
    public void setTransparent(Boolean transparent) {
        this.transparent = transparent;
    }

    /**
     * Set the transparent.
     *
     * @param transparent transparent
     */
    public void setTransparent(String transparent) {
        this.transparent = "1".equals(transparent);
    }

    /**
     * Get the attribution.
     *
     * @return attribution attribution
     */
    public String getAttribution() {
        return attribution;
    }

    /**
     * Set the attribution.
     *
     * @param attribution attribution
     */
    public void setAttribution(String attribution) {
        this.attribution = attribution;
    }

    /**
     * Gets desktop visible.
     *
     * @return the desktop visible
     */
    public Boolean getDesktopVisible() {
        return desktopVisible;
    }

    /**
     * Sets desktop visible.
     *
     * @param desktopVisible the desktop visible
     */
    public void setDesktopVisible(String desktopVisible) {
        this.desktopVisible = "1".equals(desktopVisible);
    }

    /**
     * Gets mobile visible.
     *
     * @return the mobile visible
     */
    public Boolean getMobileVisible() {
        return mobileVisible;
    }

    /**
     * Sets mobile visible.
     *
     * @param mobileVisible the mobile visible
     */
    public void setMobileVisible(String mobileVisible) {
        this.mobileVisible = "1".equals(mobileVisible);
    }

}
