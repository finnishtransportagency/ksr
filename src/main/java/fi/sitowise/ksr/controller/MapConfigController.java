package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.MapConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * MapConfig controller.
 */
@RestController
@RequestMapping(value = "/api/map")
public class MapConfigController {

    @Value("${map.center.lng}")
    private int centerLng;

    @Value("${map.center.lat}")
    private int centerLat;

    @Value("${map.scale}")
    private int scale;

    /**
     * Gets map information.
     *
     * @return the map information
     */
    @RequestMapping(value = "", method = RequestMethod.GET)
    public MapConfig getMapInformation() {
        MapConfig mapConfigInformation = new MapConfig();
        mapConfigInformation.setCenter(new int[]{centerLng, centerLat});
        mapConfigInformation.setScale(scale);
        mapConfigInformation.setPrintServiceUrl(PrintController.PRINT_CONTROLLER_URL);
        return mapConfigInformation;
    }
}
