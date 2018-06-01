package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.domain.MapLayer;
import fi.sitowise.ksr.service.MapLayerService;
import fi.sitowise.ksr.service.ProxyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
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



    @RequestMapping("/api/proxy/layer/{layerId}/**")
    public void generalProxy(
            @PathVariable Integer layerId,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        MapLayer mapLayer = mapLayerService.getMapLayerById(layerId);
        String queryString = request.getQueryString();

        String requestUri = request.getRequestURI();
        Matcher matcher = generalProxyUrlPattern.matcher(requestUri);
        String serviceEndpoint = matcher.find() ? matcher.group(1) : null;

        proxyService.get(mapLayer, queryString, request.getMethod(), serviceEndpoint, response);
    }
}
