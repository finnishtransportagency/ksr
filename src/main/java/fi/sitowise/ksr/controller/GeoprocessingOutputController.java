package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.service.GeoprocessingService;
import fi.sitowise.ksr.utils.KsrRequestUtils;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.regex.Pattern;

import static fi.sitowise.ksr.utils.KsrAuthenticationUtils.getCurrentUsername;

/**
 * Controller for geoprocessing output related requests.
 */
@RestController
@RequestMapping("/api/output")
public class GeoprocessingOutputController {

    private final GeoprocessingService geoprocessingService;
    public static final String EXTRACT_OUTPUT_URL = "/api/output/extract";
    public static final String PRINT_OUTPUT_URL = "/api/output/print";
    private Pattern extractOutputProxyUrlPattern;
    private Pattern printOutputProxyUrlPattern;

    private static final Logger LOG = LogManager.getLogger(GeoprocessingOutputController.class);

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Autowired
    public GeoprocessingOutputController(GeoprocessingService geoprocessingService) {
        this.geoprocessingService = geoprocessingService;
    }

    @PostConstruct
    public void setUpOutputProxyUrlMatchers() {
        String printPatternToMatch = "/api/output/print/(.*?)$";
        printOutputProxyUrlPattern = Pattern.compile(KsrStringUtils.replaceMultipleSlashes(printPatternToMatch));

        String extractPatternToMatch = "/api/output/extract/(.*?)$";
        extractOutputProxyUrlPattern = Pattern.compile(KsrStringUtils.replaceMultipleSlashes(extractPatternToMatch));
    }

    /**
     * Proxy print output request.
     *
     * @param request HttpServletRequest interface.
     * @param response HttpServletResponse where to write the proxy-response.
     */
    @RequestMapping(value = "/print/**", method = { RequestMethod.GET })
    public void printOutputProxy(HttpServletRequest request, HttpServletResponse response) {
        LOG.info(String.format("%s: Proxy print output -request.", getCurrentUsername()));
        String serviceEndpoint = KsrRequestUtils.getServiceEndpoint(printOutputProxyUrlPattern, request.getRequestURI());
        geoprocessingService.getPrintOutput(serviceEndpoint, request, response);
    }

    /**
     * Proxy extract output request.
     *
     * @param request HttpServletRequest interface.
     * @param response HttpServletResponse where to write the proxy-response.
     */
    @RequestMapping(value = "/extract/**", method = { RequestMethod.GET })
    public void extractOutputProxy(HttpServletRequest request, HttpServletResponse response) {
        LOG.info(String.format("%s: Proxy extract output -request.", getCurrentUsername()));
        String serviceEndpoint = KsrRequestUtils.getServiceEndpoint(extractOutputProxyUrlPattern, request.getRequestURI());
        geoprocessingService.getExtractOutput(serviceEndpoint, request, response);
    }
}
