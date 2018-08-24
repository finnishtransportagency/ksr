package fi.sitowise.ksr.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fi.sitowise.ksr.jooq.tables.records.LayerRecord;
import fi.sitowise.ksr.jooq.tables.records.UserLayerRecord;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import static java.lang.Math.toIntExact;

/**
 * A Layer-POJO which represents a map layer.
 */
public class Layer implements Serializable {
    private String id;
    private String name;
    private String type;
    private String url;
    private String layers;
    private String styles;
    private boolean visible;
    private double opacity;
    private String authentication;
    private int layerOrder;
    private int minScale;
    private int maxScale;
    private boolean transparent;
    private String attribution;
    private boolean desktopVisible;
    private boolean mobileVisible;
    private boolean queryable;
    private List<String> queryColumns;
    private boolean useInternalProxy;

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
        this.setQueryable(lr.getQueryable());
        this.setUseInternalProxy(lr.getUseInternalProxy());

        if (lr.getQueryColumns() != null) {
            this.setQueryColumns(lr.getQueryColumns());
        }
    }

    /**
     * Construct a Layer from jOOQ UserLayerRecord.
     *
     * @param lr UserLayerRecord
     */
    public Layer(UserLayerRecord lr) {
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
        this.setQueryable(lr.getQueryable());
        this.setUseInternalProxy(lr.getUseInternalProxy());

        if (lr.getQueryColumns() != null) {
            this.setQueryColumns(lr.getQueryColumns());
        }
    }

    /**
     * Get the id.
     *
     * @return id id
     */
    public String getId() {
        return id;
    }

    /**
     * Set the id.
     *
     * @param id id
     */
    public void setId(Long id) {
        this.id = String.valueOf(id);
    }

    /**
     * Set the id.
     *
     * @param id id
     */
    public void setId(String id) {
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
    public boolean getVisible() {
        return visible;
    }

    /**
     * Sets visible.
     *
     * @param visible the visible
     */
    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    /**
     * Get the opacity.
     *
     * @return opacity opacity
     */
    public double getOpacity() {
        return opacity;
    }

    /**
     * Set the opacity.
     *
     * @param opacity opacity
     */
    public void setOpacity(BigDecimal opacity) {
        this.opacity = opacity == null ? 0.0 : opacity.doubleValue();
    }

    /**
     * Set the opacity.
     *
     * @param opacity opacity
     */
    public void setOpacity(double opacity) {
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
    public int getLayerOrder() {
        return layerOrder;
    }

    /**
     * Set the layer order.
     *
     * @param layerOrder layer order
     */
    public void setLayerOrder(int layerOrder) {
        this.layerOrder = layerOrder;
    }

    /**
     * Get minimum scale.
     *
     * @return minimum scale
     */
    public int getMinScale() {
        return minScale;
    }

    /**
     * Set the minimum scale.
     *
     * @param minScale minimum scale
     */
    public void setMinScale(int minScale) {
        this.minScale = minScale;
    }

    /**
     * Get maximum scale.
     *
     * @return maximum scale
     */
    public int getMaxScale() {
        return maxScale;
    }

    /**
     * Set maximum scale.
     *
     * @param maxScale maximum scale
     */
    public void setMaxScale(int maxScale) {
        this.maxScale = maxScale;
    }

    /**
     * Get the transparent
     *
     * @return transparent transparent
     */
    public boolean getTransparent() {
        return transparent;
    }

    /**
     * Set the transparent
     *
     * @param transparent transparent
     */
    public void setTransparent(boolean transparent) {
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
    public boolean getDesktopVisible() {
        return desktopVisible;
    }

    /**
     * Sets desktop visible.
     *
     * @param desktopVisible the desktop visible
     */
    @JsonIgnore
    public void setDesktopVisible(String desktopVisible) {
        this.desktopVisible = "1".equals(desktopVisible);
    }

    /**
     * Gets mobile visible.
     *
     * @return the mobile visible
     */
    public boolean getMobileVisible() {
        return mobileVisible;
    }

    /**
     * Sets mobile visible.
     *
     * @param mobileVisible the mobile visible
     */
    @JsonIgnore
    public void setMobileVisible(String mobileVisible) {
        this.mobileVisible = "1".equals(mobileVisible);
    }

    /**
     * Is the layer queryable or not.
     *
     * @return layer's queryability
     */
    public boolean isQueryable() {
        return queryable;
    }

    /**
     * Sets layer queryability.
     *
     * @param queryable is the layer queryable
     */
    public void setQueryable(String queryable) {
        this.queryable = "1".equals(queryable);
    }

    /**
     * Gets layer's columns that can be queried with free word search.
     *
     * @return layer's queryable columns
     */
    public List<String> getQueryColumns() {
        return queryColumns;
    }

    /**
     * Sets layer's columns that can be queried with free word search.
     *
     * @param queryColumns layer's queryable columns
     */
    public void setQueryColumns(List<String> queryColumns) {
        this.queryColumns = queryColumns;
    }

    /**
     * Gets boolean value deciding if requests outgoing HTTP-requests for layer should be done via proxy
     * @return useInternalProxy if to use proxy
     */
    @JsonIgnore
    public boolean getUseInternalProxy() { return useInternalProxy; }

    /**
     * Sets boolean value deciding if requests outgoing HTTP-requests for layer should be done via proxy
     * @param useInternalProxy if to use proxy
     */
    @JsonIgnore
    public void setUseInternalProxy(String useInternalProxy) {
        this.useInternalProxy = "1".equals(useInternalProxy);
    }
}
