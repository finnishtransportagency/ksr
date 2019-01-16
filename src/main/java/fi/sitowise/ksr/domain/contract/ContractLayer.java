package fi.sitowise.ksr.domain.contract;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.esri.Feature;
import fi.sitowise.ksr.domain.esri.QueryFeature;
import fi.sitowise.ksr.domain.esri.Response;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * A partial extension of Layer to be used with contract -API.
 *
 */
public class ContractLayer {

    private String id;
    private String name;
    private String type;
    private List<Feature> features;

    /**
     * Constructs a ContactLayer from Layer and EsriQueryResponse.
     *
     * @param layer Layer to inherit from.
     */
    public ContractLayer(Layer layer, QueryFeature feature) {
        this.setId(layer.getId());
        this.setType(layer.getType());
        this.setName(layer.getName());
        this.setFeatures(Collections.singletonList(feature.getFeature()));
    }

    /**
     * Constructs a ContactLayer from Layer and EsriQueryResponse.
     *
     * @param layer Layer to inherit from.
     */
    public ContractLayer(Layer layer, Response response) {
        this.setId(layer.getId());
        this.setType(layer.getType());
        this.setName(layer.getName());
        this.setFeatures(response.getFeatures());
    }

    /**
     * Get Layer id.
     *
     * @return layer id.
     */
    public String getId() {  return id; }

    /**
     * Set Layer id.
     *
     * @param id Layer id.
     */
    public void setId(String id) { this.id = id; }

    /**
     * Get Layer name.
     *
     * @return Layer name.
     */
    public String getName() { return name; }

    /**
     * Set Layer name.
     *
     * @param name Layer name.
     */
    public void setName(String name) { this.name = name; }

    /**
     * Get Layer type.
     *
     * @return Layer type.
     */
    public String getType() { return type; }

    /**
     * Set Layer type.
     *
     * @param type Layer type.
     */
    public void setType(String type) { this.type = type; }

    /**
     * Get features in layer.
     *
     * @return Features in layer.
     */
    public List<Feature> getFeatures() { return features; }

    /**
     * Set features in layer.
     *
     * @param features Features in layer.
     */
    public void setFeatures(List<Feature> features) { this.features = features; }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof ContractLayer)) {
            return false;
        }

        ContractLayer cl = (ContractLayer) o;

        return Objects.equals(getFeatures(), cl.getFeatures())
                && Objects.equals(getId(), cl.getId())
                && Objects.equals(getName(), cl.getName())
                && Objects.equals(getType(), cl.getType());
    }
}
