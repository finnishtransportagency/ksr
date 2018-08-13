package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.LayerService;
import fi.sitowise.ksr.service.ProxyService;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * RestController for maplayer proxy.
 */
@RestController
@RequestMapping(ProxyController.PROXY_URL)
public class ProxyController {

    private Pattern generalProxyUrlPattern;

    private final LayerService layerService;

    private final ProxyService proxyService;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    public static final String PROXY_URL = "/api/proxy/layer";

    @Autowired
    public ProxyController(LayerService layerService, ProxyService proxyService) {
        this.layerService = layerService;
        this.proxyService = proxyService;
    }

    @PostConstruct
    public void setUpGeneralProxyUrlMatcher() {
        String patternToMatch = "^" + contextPath + "/api/proxy/layer/\\d{1,6}/(.*?)/*?$";
        generalProxyUrlPattern = Pattern.compile(KsrStringUtils.replaceMultipleSlashes(patternToMatch));
    }

    @RequestMapping(value = "/{layerId}/**", method = { RequestMethod.GET, RequestMethod.POST })
    public void generalProxy(@PathVariable int layerId, HttpServletRequest request,
                HttpServletResponse response) {

        String serviceEndpoint = getServiceEndpoint(request.getRequestURI());

        Layer layer = null;

        if (StringUtils.isNotEmpty(serviceEndpoint)) {
            switch (serviceEndpoint.toLowerCase()) {
                case "addfeatures":
                    if ("POST".equalsIgnoreCase(request.getMethod())) {
                        layer = layerService.getLayer(layerId, true, LayerAction.CREATE_LAYER);
                    }
                    break;
                case "deletefeatures":
                    if ("POST".equalsIgnoreCase(request.getMethod())) {
                        layer = layerService.getLayer(layerId, true, LayerAction.DELETE_LAYER);
                    }
                    break;
                case "query":
                    layer = layerService.getLayer(layerId, true, LayerAction.READ_LAYER);
                    break;
                case "updatefeatures":
                    if ("POST".equalsIgnoreCase(request.getMethod())) {
                        layer = layerService.getLayer(layerId, true, LayerAction.UPDATE_LAYER);
                    }
                    break;
                default:
                    layer = layerService.getLayer(layerId, false, LayerAction.READ_LAYER);
                    if (layer != null && layer.getType().equalsIgnoreCase("agfs")) {
                        // For agfs layers allow only separately defined actions, nothing more.
                        layer = null;
                    }
                    break;
            }
        } else {
            layer = layerService.getLayer(layerId, false, LayerAction.READ_LAYER);
        }

        if (layer == null) {
            throw new KsrApiException.NotFoundErrorException("No Layer can be found.");
        }

        String baseUrl = KsrStringUtils.replaceMultipleSlashes("/" + contextPath + "/api/proxy/layer/" + layerId);

        proxyService.get(layer, baseUrl, serviceEndpoint, request, response);
    }

    /**
     * Get serviceEndpoint (the URL-path matching controllers RequestMapping wildcard).
     *
     * @param requestUri Request URI.
     * @return The serviceEndpoint.
     */
    public String getServiceEndpoint(String requestUri) {
        if (requestUri == null) {
            return null;
        }
        Matcher matcher = generalProxyUrlPattern.matcher(requestUri);
        return matcher.find() ? matcher.group(1) : null;
    }
}
