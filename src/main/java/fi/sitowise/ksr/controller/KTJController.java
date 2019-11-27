package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.KTJService;
import io.swagger.annotations.ApiOperation;
import org.geojson.FeatureCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

/**
 * Controller for KTJ-related requests.
 */
@RestController
@RequestMapping(KTJController.ENDPOINT_URL)
public class KTJController {
    public static final String ENDPOINT_URL = "/api/property";
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
    @ApiOperation("Gets Property details for property with given property identifier.")
    @GetMapping(value = "/{propertyIdentifier}")
    public FeatureCollection getPropertyDetailsById(@PathVariable String propertyIdentifier) {
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
    @ApiOperation("Gets Property details, for property at given position (point).")
    @GetMapping(value = "/")
    public FeatureCollection getPropertyDetails(@RequestParam("x") Double x, @RequestParam("y") Double y) {
        return ktjService.getPropertyDetails(x, y);
    }

    /**
     * Gets property details from given area (polygon).
     *
     * Coordinates must be given in EPSG:3067 spatial reference system.
     *
     * @param body Request body.
     * @return FeatureCollection of property details.
     */
    @ApiOperation("Gets property details from given area (polygon).")
    @PostMapping(value = "/")
    public FeatureCollection getPropertyDetailsArea(@RequestBody Map<String, String> body) {
        String polygon = body.get("polygon");
        if (polygon != null && polygon.matches("^((\\d+\\.\\d+) (\\d+\\.\\d+) ?)*$")) {
            return  ktjService.getPropertyDetailsArea(polygon);
        }
        throw new KsrApiException.BadRequestException(
                "Parameter 'polygon' not matching pattern '^((\\d+\\.\\d+) (\\d+\\.\\d+) ?)*$'"
        );
    }

    /**
     * Get PDF print links for given property.
     *
     * @param propertyIdentifier Property's identifier in either numeric or hyphen format.
     * @param language Language of the prints.
     */
    @ApiOperation("Get PDF print links for given property.")
    @PreAuthorize("hasAnyAuthority('KSR_ROLE_ADMIN', 'KSR_ROLE_UPDATER', 'KSR_ROLE_EXTERNAL_UPDATER', 'KSR_ROLE_NAMED_USER')")
    @GetMapping(value = "/pdf/links")
    public Map<String, List<String>> getPropertyPdfLinks(@RequestParam String propertyIdentifier,
            @RequestParam String language) {
        // TODO: Disabled property PDF -query in KSR-448. 
        //  Can be added back back after API -agreement has been finished.
        throw new KsrApiException.ForbiddenException("Service not available.");
        
        // At least for now KTJ only support Finnish and Swedish as print languages.
        //if (!"fi".equalsIgnoreCase(language) && !"sv".equalsIgnoreCase(language)) {
        //    throw new KsrApiException.BadRequestException("Unsupported language.");
        //}
        //return ktjService.getPropertyPdfLinks(propertyIdentifier, language);
    }

    /**
     * Get PDF print from given url.
     *
     * @param printType Type of the print to be fetched.
     * @param response Http servlet interface to which the response is written.
     */
    @ApiOperation("Get PDF print from given url.")
    @PreAuthorize("hasAnyAuthority('KSR_ROLE_ADMIN', 'KSR_ROLE_UPDATER', 'KSR_ROLE_EXTERNAL_UPDATER', 'KSR_ROLE_NAMED_USER')")
    @GetMapping(value = "/pdf/{printType}")
    public void getPropertyPdfPrint(@PathVariable String printType, HttpServletRequest request,
            HttpServletResponse response) {
        ktjService.getPropertyPdfPrint(printType, request, response);
    }
}
