package fi.sitowise.ksr.domain;

import java.io.Serializable;

/**
 * MapConfig POJO -class.
 */
public class MapConfig implements Serializable {
    private int zoom;
    private int[] center;

    /**
     * Gets zoom.
     *
     * @return the zoom
     */
    public int getZoom() {
        return zoom;
    }

    /**
     * Sets zoom.
     *
     * @param zoom the zoom
     */
    public void setZoom(int zoom) {
        this.zoom = zoom;
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
