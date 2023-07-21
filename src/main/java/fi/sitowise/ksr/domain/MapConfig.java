package fi.sitowise.ksr.domain;

import java.io.Serializable;

/**
 * MapConfig POJO -class.
 */
public class MapConfig implements Serializable {
    private int scale;
    private int[] center;
    private String printServiceUrl;
    private String extractServiceUrl;
    private String searchApiKey;

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
     * Get url for data extraction service.
     *
     * @return Data extraction service url.
     */
    public String getExtractServiceUrl() {
        return extractServiceUrl;
    }

    /**
     * Set url for data extraction service.
     *
     * @param extractServiceUrl Data extraction service url.
     */
    public void setExtractServiceUrl(String extractServiceUrl) {
        this.extractServiceUrl = extractServiceUrl;
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

    public String getSearchApiKey() {
        return searchApiKey;
    }

    public void setSearchApiKey(String searchApiKey) {
        this.searchApiKey = searchApiKey;
    }
}
