package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.GeoconvertService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getCurrentUsername;

/**
 * Controller to convert coordinates to address.
 */
@RestController
@RequestMapping(GeoconvertController.GEOCONVERT_URL)
public class GeoconvertController {

    private final GeoconvertService geoconvertService;
    static final String GEOCONVERT_URL = "/api/geoconvert";

    private static final Logger LOG = LogManager.getLogger(GeoconvertController.class);

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Autowired
    public GeoconvertController(GeoconvertService geoconvertService) {
        this.geoconvertService = geoconvertService;
    }

    /**
     * Convert coordinates to address.
     *
     * @param request HTTP request interface.
     * @param response HTTP response where to write the fetch response.
     */
    @RequestMapping(value = "/**", method = { RequestMethod.GET })
    public void getGeoconvertData(HttpServletRequest request, HttpServletResponse response) {
        LOG.info(String.format("%s: Convert coordinates to address.", getCurrentUsername()));

        String featureType = request.getParameter("featureType");
        String y = request.getParameter("y");
        String x = request.getParameter("x");

        if (featureType == null || y == null || x == null) {
            throw new KsrApiException.BadRequestException("Invalid query parameters given.");
        }

        geoconvertService.getConvertedData(request, response, featureType, y, x);
    }
}
