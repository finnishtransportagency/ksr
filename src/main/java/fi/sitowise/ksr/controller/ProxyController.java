package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.MapLayer;
import fi.sitowise.ksr.service.MapLayerService;
import fi.sitowise.ksr.service.ProxyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class ProxyController {

    private Pattern generalProxyUrlPattern;

    @Autowired
    private MapLayerService mapLayerService;

    @Autowired
    private ProxyService proxyService;


    @Autowired
    public void setUpGeneralProxyUrlMatcher() {
        generalProxyUrlPattern = Pattern.compile("^\\/api\\/proxy\\/layer\\/\\d{1,6}\\/(.*?)$");
    }

    @CrossOrigin(origins = "http://localhost")
    @RequestMapping("/api/proxy/layer/{layerId}/**")
    public void generalProxy(
            @PathVariable int layerId,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        MapLayer mapLayer = mapLayerService.getMapLayerById(layerId);

        String queryString = request.getQueryString();
        String serviceEndpoint = getServiceEndpoint(request.getRequestURI());
        String baseUrl = "/api/proxy/layer/" + layerId;

        proxyService.get(mapLayer, baseUrl, queryString, request.getMethod(), serviceEndpoint, response);
    }

    /**
     * Get serviceEndpoint (the URL-path matching controllers RequestMapping wildcard).
     *
     * @param requestUri Request URI.
     * @return The serviceEndpoint.
     */
    public String getServiceEndpoint(String requestUri) {
        Matcher matcher = generalProxyUrlPattern.matcher(requestUri);
        return matcher.find() ? matcher.group(1) : null;
    }
}
