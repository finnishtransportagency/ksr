package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.service.KTJService;
import org.geojson.FeatureCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for KTJ-related requests.
 */
@RestController
@RequestMapping("/api/property")
public class KTJController {

    private final KTJService ktjService;

    @Autowired
    public KTJController(KTJService ktjService) {
        this.ktjService = ktjService;
    }

    /**
     * Gets Property details for property with given property identifier.
     *
     * Property identifier can be in either numeric format or in hyphen format.
     * Numeric format: 09100200110001
     * Hyphen format:  91-2-11-1
     *
     * @param propertyIdentifier Property identifier.
     * @return FeatureCollection of property details.
     */
    @RequestMapping(value = "/{propertyIdentifier}", method = { RequestMethod.GET })
    public FeatureCollection getPropertyDetails(@PathVariable String propertyIdentifier) {
        return ktjService.getPropertyDetails(propertyIdentifier);
    }

    /**
     * Gets Property details, for property at given position (point).
     *
     * Coordinates must be given in EPSG:3067 spatial reference system.
     *
     * @param x X coordinate.
     * @param y Y coordinate.
     * @return FeatureCollection of property details.
     */
    @RequestMapping(value = "/", method = { RequestMethod.GET })
    public FeatureCollection getPropertyDetails(@RequestParam("x") Double x, @RequestParam("y") Double y) {
        return ktjService.getPropertyDetails(x, y);
    }
}
