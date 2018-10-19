package fi.sitowise.ksr.domain;

import fi.sitowise.ksr.jooq.tables.records.LayerPermissionRecord;

import java.io.Serializable;

/**
 * Layer permission POJO for layers.
 */
public class LayerPermission implements Serializable {
    private boolean createLayer;
    private boolean readLayer;
    private boolean updateLayer;
    private boolean deleteLayer;

    /**
     * Instantiates a new LayerPermission.
     */
    public LayerPermission() {}

    /**
     * Construct a LayerPermission from jOOQ LayerPermissionRecord.
     *
     * @param lpr LayerPermissionRecord, jOOQ generated.
     */
    public LayerPermission(LayerPermissionRecord lpr) {
        this.setCreateLayer(lpr.getCreateLayer());
        this.setReadLayer(lpr.getReadLayer());
        this.setUpdateLayer(lpr.getUpdateLayer());
        this.setDeleteLayer(lpr.getDeleteLayer());
    }

    /**
     * Is create layer permission.
     *
     * @return Is create layer permission.
     */
    public boolean isCreateLayer() {
        return createLayer;
    }

    /**
     * Sets create layer permission.
     *
     * @param createLayer create layer permission.
     */
    public void setCreateLayer(String createLayer) {
        this.createLayer = "1".equals(createLayer);
    }

    /**
     * Is read layer permission.
     *
     * @return Is read layer permission.
     */
    public boolean isReadLayer() {
        return readLayer;
    }

    /**
     * Sets read layer permission.
     *
     * @param readLayer read layer permission.
     */
    public void setReadLayer(String readLayer) {
        this.readLayer = "1".equals(readLayer);
    }

    /**
     * Is update layer permission.
     *
     * @return Is update layer permission.
     */
    public boolean isUpdateLayer() {
        return updateLayer;
    }

    /**
     * Sets update layer permission.
     *
     * @param updateLayer update layer permission.
     */
    public void setUpdateLayer(String updateLayer) {
        this.updateLayer = "1".equals(updateLayer);
    }

    /**
     * Is delete layer permission.
     *
     * @return Is delete layer permission.
     */
    public boolean isDeleteLayer() {
        return deleteLayer;
    }

    /**
     * Sets delete layer permission.
     *
     * @param deleteLayer delete layer permission.
     */
    public void setDeleteLayer(String deleteLayer) {
        this.deleteLayer = "1".equals(deleteLayer);
    }
}
