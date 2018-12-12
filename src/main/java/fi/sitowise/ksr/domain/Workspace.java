package fi.sitowise.ksr.domain;

import fi.sitowise.ksr.jooq.tables.records.WorkspaceLayerRecord;
import fi.sitowise.ksr.jooq.tables.records.WorkspaceRecord;
import org.hibernate.validator.constraints.SafeHtml;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.lang.Math.toIntExact;

/**
 * POJO representing a workspace.
 */
public class Workspace implements Serializable {

    @SafeHtml
    private String name;

    private int id;
    private UUID uuid;
    private int scale;
    private int centerLongitude;
    private int centerLatitude;
    private Timestamp updateTime;
    private List<WorkspaceLayer> layers;

    /**
     * Constructs Workspace object.
     */
    public Workspace() {

    }

    /**
     * Constructs Workspace from jOOQ's WorkspaceRecord and WorkspaceLayerRecords.
     *
     * @param wsr workspace record used for constructing the workspace
     * @param wslr list of workspace layer records used for constructing the workspace
     */
    public Workspace(WorkspaceRecord wsr, List<WorkspaceLayerRecord> wslr) {
        this.id = toIntExact(wsr.getId());
        this.name = wsr.getName();
        this.scale = wsr.getScale();
        this.centerLongitude = wsr.getCenterLongitude();
        this.centerLatitude = wsr.getCenterLatitude();
        this.updateTime = wsr.getUpdated();
        this.uuid = UUID.fromString(wsr.getUuid());

        if (wslr != null) {
            this.layers = wslr.stream().map(WorkspaceLayer::new).collect(Collectors.toList());
        }
    }

    /**
     * @return workspace's id
     */
    public int getId() {
        return id;
    }

    /**
     * Set workspace id.
     *
     * @param id id of the workspace
     */
    public void setId(Long id) {
        this.id = toIntExact(id);
    }

    /**
     * @return name of the workspace
     */
    public String getName() {
        return name;
    }

    /**
     * Set name for the workspace.
     *
     * @param name name of the workspace
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return map scale for the workspace
     */
    public int getScale() {
        return scale;
    }

    /**
     * Set map scale for the workspace.
     *
     * @param scale scale of the map
     */
    public void setScale(int scale) {
        this.scale = scale;
    }

    /**
     * @return longitude value of map's center point
     */
    public int getCenterLongitude() {
        return centerLongitude;
    }

    /**
     * Set longitude value of map's center point.
     *
     * @param centerLongitude longitude value of map's center point
     */
    public void setCenterLongitude(int centerLongitude) {
        this.centerLongitude = centerLongitude;
    }

    /**
     * @return latitude value of map's center point
     */
    public int getCenterLatitude() {
        return centerLatitude;
    }

    /**
     * Set latitude value of map's center point.
     *
     * @param centerLatitude latitude value of map's center point
     */
    public void setCenterLatitude(int centerLatitude) {
        this.centerLatitude = centerLatitude;
    }

    /**
     * @return when the workspace was updated
     */
    public Timestamp getUpdateTime() {
        return updateTime;
    }

    /**
     * Set update time of the workspace.
     *
     * @param updateTime update time of the workspace
     */
    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * @return list of layers that belong to the workspace
     */
    public List<WorkspaceLayer> getLayers() {
        return layers;
    }

    /**
     * Set layers for the workspace.
     *
     * @param layers list of layers that belong to the workspace
     */
    public void setLayers(List<WorkspaceLayer> layers) {
        this.layers = layers;
    }

    /**
     * @return UUID -identifier for the workspace
     */
    public UUID getUuid() { return uuid; }

    /**
     * Set UUID of the workspace.
     *
     * @param uuid UUID of the workspace
     */
    public void setUuid(UUID uuid) { this.uuid = uuid; }
}
