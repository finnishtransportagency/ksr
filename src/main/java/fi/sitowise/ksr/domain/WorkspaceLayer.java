package fi.sitowise.ksr.domain;

import fi.sitowise.ksr.jooq.tables.records.WorkspaceLayerRecord;
import fi.sitowise.ksr.jooq.udt.records.FeatureTableTypeRecord;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * POJO representing a workspace layer.
 */
public class WorkspaceLayer implements Serializable {
    private String layerId;
    private String userLayerId;
    private boolean visible;
    private double opacity;
    private int layerOrder;
    private String definitionExpression;
    private FeatureTableTypeRecord selectedFeatures;

    /**
     * Constructs WorkspaceLayer object.
     */
    public WorkspaceLayer() {

    }

    /**
     * Constructs WorkspaceLayer from jOOQ's WorkspaceLayerRecord.
     *
     * @param wslr workspace layer record used for constructing the layer
     */
    public WorkspaceLayer(WorkspaceLayerRecord wslr) {
        setLayerId(wslr.getLayerId());
        setUserLayerId(wslr.getUserLayerId());
        setVisible(wslr.getVisible());
        setOpacity(wslr.getOpacity());
        setLayerOrder(wslr.getLayerOrder());
        setDefinitionExpression(wslr.getDefinitionExpression());

        if (wslr.getSelectedFeatures() != null) {
            setSelectedFeatures(wslr.getSelectedFeatures());
        }
    }

    /**
     * @return referenced layer's id
     */
    public String getLayerId() {
        return layerId;
    }

    /**
     * Set referenced layer id for the workspace layer.
     *
     * @param layerId id of the referenced layer
     */
    public void setLayerId(Long layerId) {
        this.layerId = String.valueOf(layerId);
    }

    /**
     * @return referenced user layer's id
     */
    public String getUserLayerId() {
        return userLayerId;
    }

    /**
     * Set referenced user layer id for the workspace layer.
     *
     * @param userLayerId id of the referenced user layer
     */
    public void setUserLayerId(Long userLayerId) {
        this.userLayerId = String.valueOf(userLayerId);
    }

    /**
     * @return whether the layer is visible or not
     */
    public boolean getVisible() {
        return visible;
    }

    /**
     * Set layer's visibility.
     *
     * @param visible whether the layer is visible or not
     */
    public void setVisible(String visible) {
        this.visible = "1".equals(visible);
    }

    /**
     * @return layer's opacity
     */
    public double getOpacity() {
        return opacity;
    }

    /**
     * Set layer's opacity.
     *
     * @param opacity opacity to be set for the layer
     */
    public void setOpacity(BigDecimal opacity) {
        this.opacity = opacity == null ? 0.0 : opacity.doubleValue();
    }

    /**
     * @return layer's order
     */
    public Integer getLayerOrder() {
        return layerOrder;
    }

    /**
     * Set layer's order.
     *
     * @param layerOrder order of the layer
     */
    public void setLayerOrder(Integer layerOrder) {
        this.layerOrder = layerOrder;
    }

    /**
     * @return filter query for the layer
     */
    public String getDefinitionExpression() {
        return definitionExpression;
    }

    /**
     * Set filter query for the layer's features.
     *
     * @param definitionExpression filter query for the layer's features
     */
    public void setDefinitionExpression(String definitionExpression) {
        this.definitionExpression = definitionExpression;
    }

    /**
     * @return list of selected features
     */
    public FeatureTableTypeRecord getSelectedFeatures() {
        return selectedFeatures;
    }

    /**
     * Set selected features for the layer. Also holds information
     * whether a feature is highlighted or not.
     *
     * @param selectedFeatures list of selected features and highlight statuses
     */
    public void setSelectedFeatures(FeatureTableTypeRecord selectedFeatures) {
        this.selectedFeatures = selectedFeatures;
    }
}
