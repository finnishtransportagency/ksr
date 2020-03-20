package fi.sitowise.ksr.domain;

import fi.sitowise.ksr.jooq.tables.records.RelationRecord;

import java.io.Serializable;

/**
 * A Relation POJO for layer.
 */
public class Relation implements Serializable {

    private String layerId;
    private String relationType;
    private Long relationLayerId;
    private String relationColumnIn;
    private String relationColumnOut;

    /**
     * Construct a Relation.
     */
    public Relation() {
    }

    /**
     * Construct a Relation from jOOQ RelationRecord.
     *
     * @param rr RelationRecord, jOOQ generated.
     */
    public Relation(RelationRecord rr) {
        this.setLayerId(rr.getLayerId());
        this.setRelationColumnIn(rr.getRelationColumnIn());
        this.setRelationColumnOut(rr.getRelationColumnOut());
        this.setRelationLayerId(rr.getRelationLayerId());
        this.setRelationType(rr.getRelationType());
    }

    /**
     * Gets layer id.
     *
     * @return Id of the layer.
     */
    public String getLayerId() {
        return layerId;
    }

    /**
     * Sets layer Id.
     *
     * @param layerId Id of the layer.
     */
    public void setLayerId(Long layerId) {
        this.layerId = String.valueOf(layerId);
    }

    /**
     * Gets type of relation. Possible values are "one", "many", "link" and null.
     *
     * @return Type of relation.
     */
    public String getRelationType() {
        return relationType;
    }

    /**
     * Sets type of relation.
     *
     * @param relationType Type of relation.
     */
    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    /**
     * Gets id of the relation layer. On database level, references on another entry in Layer-table.
     *
     * @return Id of the relation layer.
     */
    public Long getRelationLayerId() {
        return relationLayerId;
    }

    /**
     * Sets id of the relation layer. On database level, references on another entry in Layer-table.
     *
     * @param relationLayerId Id of the relation layer.
     */
    public void setRelationLayerId(Long relationLayerId) {
        this.relationLayerId = relationLayerId;
    }

    /**
     * Gets name of the column another layer references to.
     *
     * @return Name of the column another layer references to.
     */
    public String getRelationColumnIn() {
        return relationColumnIn;
    }

    /**
     * Sets name of the column another layer references to.
     *
     * @param relationColumnIn Name of the column another layer references to.
     */
    public void setRelationColumnIn(String relationColumnIn) {
        this.relationColumnIn = relationColumnIn;
    }

    /**
     * Gets name of the column which references to another layer.
     *
     * @return Name of the column which references to another layer
     */
    public String getRelationColumnOut() {
        return relationColumnOut;
    }

    /**
     * Sets name of the column which references to another layer
     *
     * @param relationColumnOut Name of the column which references to another layer
     */
    public void setRelationColumnOut(String relationColumnOut) {
        this.relationColumnOut = relationColumnOut;
    }

}
