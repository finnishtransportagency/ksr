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
    private Integer minZoom;
    private Integer maxZoom;
    private Boolean transparent;
    private String attribution;

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
        this.setVisible(lr.getVisible());
        this.setOpacity(lr.getOpacity());
        this.setAuthentication(lr.getAuthentication());
        this.setLayerOrder(lr.getLayerOrder());
        this.setMinZoom(lr.getMinZoom());
        this.setMaxZoom(lr.getMaxZoom());
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
     * Get the visible
     *
     * @return visible visible
     */
    public Boolean getVisible() {
        return visible;
    }

    /**
     * Set the visible
     *
     * @param visible visible
     */
    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    /**
     * Set the visible
     *
     * @param visible visible
     */
    public void setVisible(String visible) {
        this.visible = "1".equals(visible);
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
     * Get the min zoom.
     *
     * @return min zoom
     */
    public Integer getMinZoom() {
        return minZoom;
    }

    /**
     * Set the min zoom.
     *
     * @param minZoom min zoom
     */
    public void setMinZoom(Integer minZoom) {
        this.minZoom = minZoom;
    }

    /**
     * Get the max zoom.
     *
     * @return max zoom
     */
    public Integer getMaxZoom() {
        return maxZoom;
    }

    /**
     * Set the max zoom
     *
     * @param maxZoom max zoom
     */
    public void setMaxZoom(Integer maxZoom) {
        this.maxZoom = maxZoom;
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
}
