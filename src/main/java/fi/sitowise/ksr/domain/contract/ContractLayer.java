package fi.sitowise.ksr.domain.contract;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.proxy.EsriQueryResponse;

import java.util.Objects;

/**
 * A partial extension of Layer to be used with contract -API.
 *
 */
public class ContractLayer {

    private String id;
    private String name;
    private String type;
    private EsriQueryResponse data;

    /**
     * Constructs a ContactLayer from Layer and EsriQueryResponse.
     *
     * @param layer Layer to inherit from.
     * @param data Esri JSON data.
     */
    public ContractLayer(Layer layer, EsriQueryResponse data) {
        this.setId(layer.getId());
        this.setType(layer.getType());
        this.setName(layer.getName());
        this.setData(data);
    }

    /**
     * Get Esri JSON-data.
     *
     * @return the Esri JSON-data.
     */
    public EsriQueryResponse getData() { return data; }

    /**
     * Set Esri JSON-data.
     *
     * @param data Esri JSON-data.
     */
    public void setData(EsriQueryResponse data) { this.data = data; }

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

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof ContractLayer)) {
            return false;
        }

        ContractLayer cl = (ContractLayer) o;

        return Objects.equals(getData(), cl.getData())
                && Objects.equals(getId(), cl.getId())
                && Objects.equals(getName(), cl.getName())
                && Objects.equals(getType(), cl.getType());
    }
}
