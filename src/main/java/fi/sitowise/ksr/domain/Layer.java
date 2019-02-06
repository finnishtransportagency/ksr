package fi.sitowise.ksr.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import fi.sitowise.ksr.jooq.tables.records.LayerPermissionRecord;
import fi.sitowise.ksr.jooq.tables.records.LayerRecord;
import fi.sitowise.ksr.jooq.tables.records.UserLayerRecord;
import fi.sitowise.ksr.jooq.udt.records.QueryColumnTypeRecord;
import org.hibernate.validator.constraints.SafeHtml;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

/**
 * A Layer-POJO which represents a map layer.
 */
public class Layer implements Serializable {

    @SafeHtml
    private String name;

    @SafeHtml
    private String url;

    @SafeHtml
    private String layers;

    @SafeHtml
    private String styles;

    @SafeHtml
    private String attribution;

    @SafeHtml
    private String addressField;

    private String id;
    private String type;
    private boolean visible;
    private double opacity;
    private String authentication;
    private int layerOrder;
    private int minScale;
    private int maxScale;
    private boolean transparent;
    private boolean desktopVisible;
    private boolean mobileVisible;
    private boolean queryable;
    private boolean useInternalProxy;
    private boolean userLayer;
    private String featureType;
    private String updaterField;
    private LayerPermission layerPermission;
    private boolean hasRelations;
    private String contractIdField;
    private String contractDescriptionField;
    private String alfrescoLinkField;
    private String caseManagementLinkField;
    private String relationType;
    private Long relationLayerId;
    private String relationColumnIn;
    private String relationColumnOut;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private QueryColumnTypeRecord queryColumns;
    private boolean background;
    private String parentLayer;

    /**
     * Construct a Layer.
     */
    public Layer() { }

    /**
     * Construct a Layer from jOOQ LayerRecord and LayerPermissionRecord.
     *
     * @param lr  LayerRecord, jOOQ generated.
     * @param lpr LayerPermissionRecord, jOOQ generated.
     */
    public Layer(LayerRecord lr, LayerPermissionRecord lpr) {
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
        this.setUserLayer(false);
        this.setAddressField(lr.getAddressField());
        this.setFeatureType(lr.getFeatureType());
        this.setUpdaterField(lr.getUpdaterField());
        this.setRelationColumnIn(lr.getRelationColumnIn());
        this.setRelationColumnOut(lr.getRelationColumnOut());
        this.setRelationLayerId(lr.getRelationLayerId());
        this.setRelationType(lr.getRelationType());
        this.setContractIdField(lr.getContractIdField());
        this.setContractDescriptionField(lr.getContractDescriptionField());
        this.setAlfrescoLinkField(lr.getAlfrescoLinkField());
        this.setCaseManagementLinkField(lr.getCaseManagementLinkField());
        this.setBackground(lr.getBackground());
        this.setParentLayer(lr.getParentLayer());

        if (lr.getQueryColumns() != null) {
            setQueryColumns(lr.getQueryColumns());
        }
        if (lpr != null) {
            this.setLayerPermission(new LayerPermission(lpr));
        }

        boolean hasRelations = lr.getRelationColumnOut() != null
                && lr.getRelationLayerId() != null
                && ("one".equals(lr.getRelationType()) || "many".equals(lr.getRelationType()));
        this.setHasRelations(hasRelations);
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
        this.setUserLayer(true);

        if (lr.getQueryColumns() != null) {
            setQueryColumns(lr.getQueryColumns());
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
//    @JsonIgnore
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
     * Gets layer's columns that can be queried with free word search. (client uses it)
     *
     * @return layer's queryable columns
     */
    public List<String> getQueryColumnsList() {
        return queryColumns;
    }

    /**
     * Gets boolean value deciding if requests outgoing HTTP-requests for layer should be done via proxy
     *
     * @return useInternalProxy if to use proxy
     */
    @JsonIgnore
    public boolean getUseInternalProxy() { return useInternalProxy; }

    /**
     * Sets boolean value deciding if requests outgoing HTTP-requests for layer should be done via proxy
     *
     * @param useInternalProxy if to use proxy
     */
    @JsonIgnore
    public void setUseInternalProxy(String useInternalProxy) {
        this.useInternalProxy = "1".equals(useInternalProxy);
    }

    /**
     * Returns if layer is user-defined layer
     *
     * @return is an user defined layer
     */
    public boolean isUserLayer() {
        return userLayer;
    }

    /**
     * Set's if layer is user-defined layer
     *
     * @param userLayer is an user defined layer
     */
    public void setUserLayer(boolean userLayer) {
        this.userLayer = userLayer;
    }

    /**
     * Gets layer's address field name
     *
     * @return layer's address field name
     */
    public String getAddressField() {
        return addressField;
    }

    /**
     * Sets layer's address field name
     *
     * @param addressField layer's address field name
     */
    public void setAddressField(String addressField) {
        this.addressField = addressField;
    }

    /**
     * Gets layer's feature type column that can be used in geo conversion
     *
     * @return layer's feature type column
     */
    public String getFeatureType() {
        return featureType;
    }

    /**
     * Sets layer's feature type column that can be used in geo conversion
     *
     * @param featureType layer's feature type column
     */
    public void setFeatureType(String featureType) {
        this.featureType = featureType;
    }

    /**
     * Get's layer's updater field.
     *
     * @return Layer's updater field.
     */
    public String getUpdaterField() { return updaterField; }

    /**
     * Sets layer's updater field.
     *
     * @param updaterField Layer's updater field.
     */
    public void setUpdaterField(String updaterField) { this.updaterField = updaterField; }

    /**
     * Gets layer permission.
     *
     * @return Layer permission.
     */
    public LayerPermission getLayerPermission() {
        return layerPermission;
    }

    /**
     * Sets layer permission.
     *
     * @param layerPermission Layer permission.
     */
    public void setLayerPermission(LayerPermission layerPermission) {
        this.layerPermission = layerPermission;
    }


    /**
     * Returns boolean indicating if layer has relations.
     *
     * @return Boolean indicating if layer has relations.
     */
    public boolean isHasRelations() { return hasRelations; }

    /**
     * Sets boolean indicating if layer has relations.
     *
     * @param hasRelations Boolean indicating if layer has relations.
     */
    public void setHasRelations(boolean hasRelations) { this.hasRelations = hasRelations; }

    /**
     * Gets type of relation. Possible values are "one", "many", "link" and null.
     *
     * @return Type of relation.
     */
    public String getRelationType() { return relationType; }

    /**
     * Sets type of relation.
     *
     * @param relationType Type of relation.
     */
    public void setRelationType(String relationType) { this.relationType = relationType; }

    /**
     * Gets id of the relation layer. On database level, references on another entry in Layer-table.
     *
     * @return Id of the relation layer.
     */
    public Long getRelationLayerId() { return relationLayerId; }

    /**
     * Sets id of the relation layer. On database level, references on another entry in Layer-table.
     *
     * @param relationLayerId Id of the relation layer.
     */
    public void setRelationLayerId(Long relationLayerId) { this.relationLayerId = relationLayerId; }

    /**
     * Gets name of the column another layer references to.
     *
     * @return Name of the column another layer references to.
     */
    public String getRelationColumnIn() { return relationColumnIn; }

    /**
     * Sets name of the column another layer references to.
     *
     * @param relationColumnIn Name of the column another layer references to.
     */
    public void setRelationColumnIn(String relationColumnIn) { this.relationColumnIn = relationColumnIn; }

    /**
     * Gets name of the column which references to another layer.
     *
     * @return Name of the column which references to another layer
     */
    public String getRelationColumnOut() { return relationColumnOut; }

    /**
     * Sets name of the column which references to another layer
     *
     * @param relationColumnOut Name of the column which references to another layer
     */
    public void setRelationColumnOut(String relationColumnOut) { this.relationColumnOut = relationColumnOut; }

    /**
     * Gets name of contract-relation id field to be shown in contract list.
     *
     * @return Contract id field name.
     */
    public String getContractIdField() {
        return contractIdField;
    }

    /**
     * Sets layers contract id field name.
     *
     * @param contractIdField Contract id field name.
     */
    public void setContractIdField(String contractIdField) {
        this.contractIdField = contractIdField;
    }

    /**
     * Gets name of contract-relation description field to be shown in contract list.
     *
     * @return Contract description field name.
     */
    public String getContractDescriptionField() {
        return contractDescriptionField;
    }

    /**
     * Sets layers contract description field name.
     *
     * @param contractDescriptionField Contract description field name.
     */
    public void setContractDescriptionField(String contractDescriptionField) {
        this.contractDescriptionField = contractDescriptionField;
    }

    /**
     * Gets layer Alfresco link fields.
     *
     * @return Alfresco link field(s).
     */
    public String getAlfrescoLinkField() {
        return alfrescoLinkField;
    }

    /**
     * Sets layers Alfresco link fields.
     *
     * @param alfrescoLinkField Alfresco link field name.
     */
    public void setAlfrescoLinkField(String alfrescoLinkField) {
        this.alfrescoLinkField = alfrescoLinkField;
    }

    /**
     * Gets layer case management link fields.
     *
     * @return Case management link field(s).
     */
    public String getCaseManagementLinkField() {
        return caseManagementLinkField;
    }

    /**
     * Sets layers case management link fields.
     *
     * @param caseManagementLinkField Case management link field name.
     */
    public void setCaseManagementLinkField(String caseManagementLinkField) {
        this.caseManagementLinkField = caseManagementLinkField;
    }

    /**
     * @return query columns as jOOQ table type record
     */
    @JsonIgnore
    public QueryColumnTypeRecord getQueryColumns() {
        return queryColumns;
    }

    /**
     * Set query columns for the layer
     *
     * @param queryColumns list of query columns
     */
    public void setQueryColumns(QueryColumnTypeRecord queryColumns) {
        this.queryColumns = queryColumns;
    }

    /**
     * Gets if layer can be considered a background layer.
     *
     * @return boolean indicating if layer can be considered a background layer.
     */
    public boolean isBackground()  { return background; }

    /**
     * Sets boolean indicating if layer can be considered a background layer.
     *
     * @param background String indicating if background layer.
     */
    public void setBackground(String background) {
        this.background = "1".equals(background);
    }

    /**
     * Gets parent layer id.
     *
     * @return Parent layer id.
     */
    public String getParentLayer() {
        return parentLayer;
    }

    /**
     * Set parent layer Id.
     *
     * @param parentLayer Id of the parent layer.
     */
    public void setParentLayer(Long parentLayer) {
        if (Objects.isNull(parentLayer)) {
            this.parentLayer = null;
        } else {
            this.parentLayer = String.valueOf(parentLayer);
        }
    }
}
