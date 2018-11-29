package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.GeoprocessingService;
import fi.sitowise.ksr.utils.KsrRequestUtils;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.regex.Pattern;

/**
 * Controller to proxy geoprocessing related requests.
 */
@RestController
@RequestMapping(GeoprocessingController.GEOPROCESSING_URL)
public class GeoprocessingController {

    private Pattern printProxyUrlPattern;
    private final GeoprocessingService geoprocessingService;
    static final String PRINT_CONTROLLER_URL = "/api/GPServer/Export Web Map Task";
    static final String GEOPROCESSING_URL = "/api/GPServer";

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Autowired
    public GeoprocessingController(GeoprocessingService geoprocessingService) {
        this.geoprocessingService = geoprocessingService;
    }

    @PostConstruct
    public void setUpPrintProxyUrlMatcher() {
        String printPatternToMatch = "/api/GPServer/Export%20Web%20Map%20Task/(.*?)$";
        printProxyUrlPattern = Pattern.compile(KsrStringUtils.replaceMultipleSlashes(printPatternToMatch));
    }

    @RequestMapping(value = "/**", method = { RequestMethod.GET, RequestMethod.POST })
    public void printProxy(HttpServletRequest request, HttpServletResponse response) {
        String serviceEndpoint = KsrRequestUtils.getServiceEndpoint(printProxyUrlPattern, request.getRequestURI());
        try {
            geoprocessingService.getPrintRequest(serviceEndpoint, request, response);
        } catch (ParseException | IOException e) {
            String msg = "Error handling print request";
            throw new KsrApiException.InternalServerErrorException(msg, e);
        }
    }
}
