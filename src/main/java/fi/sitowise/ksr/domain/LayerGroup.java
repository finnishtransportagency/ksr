package fi.sitowise.ksr.domain;

import fi.sitowise.ksr.jooq.tables.records.LayerGroupRecord;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import static java.lang.Math.toIntExact;

/**
 * LayerGroup POJO representing LayerGroup which holds unspecified amount of Layers.
 */
public class LayerGroup implements Serializable {
    private int id;
    private String name;
    private int groupOrder;
    private List<Layer> layers;

    /**
     * Instantiates a new Layer group.
     */
    public LayerGroup(){}

    /**
     * Construct a LayerGroup from relevant jOOQ records.
     *
     * @param lrr      LayerGroupRecord, jOOQ generated.
     * @param ll       List of layers.
     */
    public LayerGroup (LayerGroupRecord lrr, List<Layer> ll) {
        this.id = toIntExact(lrr.getId());
        this.name = lrr.getName();
        this.groupOrder = lrr.getGroupOrder();
        this.layers = new ArrayList<>(ll);
    }

    /**
     * Get the id.
     *
     * @return id id
     */
    public int getId() {
        return id;
    }

    /**
     * Set's the id.
     *
     * @param id Id
     */
    public void setId(int id) {
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
     * Set's the name.
     *
     * @param name Name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the groupOrder.
     *
     * @return groupOrder group order
     */
    public int getGroupOrder() {
        return groupOrder;
    }

    /**
     * Set's the groupOrder.
     *
     * @param groupOrder GroupOrder.
     */
    public void setGroupOrder(int groupOrder) {
        this.groupOrder = groupOrder;
    }

    /**
     * Get the Layers.
     *
     * @return Layers layers
     */
    public List<Layer> getLayers() {
        return layers;
    }

    /**
     * Set's the Layers.
     *
     * @param layers Layers.
     */
    public void setLayers(List<Layer> layers) {
        this.layers = layers;
    }
}
