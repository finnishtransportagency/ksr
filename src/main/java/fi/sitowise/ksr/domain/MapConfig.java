package fi.sitowise.ksr.domain;

import java.io.Serializable;

/**
 * MapConfig POJO -class.
 */
public class MapConfig implements Serializable {
    private int scale;
    private int[] center;
    private String printServiceUrl;

    /**
     * Gets printServiceUrl
     *
     * PrintServiceUrl is an url pointing into a ArcGIS Server Web Map Task -service
     *
     * @return printServiceUrl
     */
    public String getPrintServiceUrl() {
        return printServiceUrl;
    }

    /**
     * Sets printServiceUrl
     *
     * PrintServiceUrl is an url pointing into a ArcGIS Server Web Map Task -service
     *
     * @param printServiceUrl printServiceUrl
     */
    public void setPrintServiceUrl(String printServiceUrl) {
        this.printServiceUrl = printServiceUrl;
    }

    /**
     * Gets scale.
     *
     * @return scale
     */
    public int getScale() {
        return scale;
    }

    /**
     * Sets scale.
     *
     * @param scale scale
     */
    public void setScale(int scale) {
        this.scale = scale;
    }

    /**
     * Get center int [ ].
     *
     * @return the int [ ]
     */
    public int[] getCenter() {
        return center;
    }

    /**
     * Sets center.
     *
     * @param center the center
     */
    public void setCenter(int[] center) {
        this.center = center;
    }
}
