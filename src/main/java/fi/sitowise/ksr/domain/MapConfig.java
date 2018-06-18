package fi.sitowise.ksr.domain;

import java.io.Serializable;

/**
 * MapConfig POJO -class.
 */
public class MapConfig implements Serializable {
    private int scale;
    private int[] center;

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
