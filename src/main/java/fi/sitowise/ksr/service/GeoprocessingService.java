package fi.sitowise.ksr.service;

import fi.sitowise.ksr.utils.KsrGeoprocessingUtils;
import org.apache.http.NameValuePair;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.List;

/**
 * Geoprocessing service.
 */
@Service
public class GeoprocessingService {

    private final HttpRequestService httpRequestService;
    private final LayerService layerService;
    private final ProxyService proxyService;

    @Value("${print.service.url}")
    private String printServiceUrl;

    @Value("${print.output.url}")
    private String printOutputUrl;

    @Value("${extract.service.url}")
    private String extractServiceUrl;

    @Value("${extract.output.url}")
    private String extractOutputUrl;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Autowired
    public GeoprocessingService(HttpRequestService httpRequestService, LayerService layerService, ProxyService proxyService) {
        this.httpRequestService = httpRequestService;
        this.layerService = layerService;
        this.proxyService = proxyService;
    }

    /**
     * Proxy print request and modify request parameters to match correct URLs
     *
     * @param serviceEndpoint Service specific endpoint, after mapLayers base url.
     * @param request HTTP request interface.
     * @param response HttpServletResponse where to write the proxy-response
     */
    public void getPrintRequest(String serviceEndpoint, HttpServletRequest request,
            HttpServletResponse response) throws IOException, ParseException {
        String endPointUrl = proxyService
                .getEndpointUrl(printServiceUrl, serviceEndpoint, request.getQueryString());
        String decodedServiceEndpoint = serviceEndpoint == null ?
                null : URLDecoder.decode(serviceEndpoint, "UTF-8");

        if (decodedServiceEndpoint == null) {
            this.httpRequestService.fetchToResponse(null, null, printServiceUrl,
                    endPointUrl, request, response, false, null, null);
        } else if (request.getParameterMap().containsKey("Web_Map_as_JSON")) {
            List<NameValuePair> editedParams = KsrGeoprocessingUtils
                    .createPrintParams(request, layerService);
            this.httpRequestService.fetchToResponse(null, null, printServiceUrl,
                    endPointUrl, request, response, false, editedParams, null);
        } else if (request.getQueryString().equals("f=json")) {
            this.httpRequestService.fetchToResponse(null, null, printServiceUrl,
                    endPointUrl, request, response, false, null, null);
        }
    }

    /**
     * Proxy print output into given endpoint
     *
     * @param serviceEndpoint Service specific endpoint, after mapLayers base url.
     * @param request HTTP request interface.
     * @param response HttpServletResponse where to write the proxy-response
     */
    public void getPrintOutput(String serviceEndpoint, HttpServletRequest request,
            HttpServletResponse response) {
        String endPointUrl = proxyService
                .getEndpointUrl(printOutputUrl, serviceEndpoint, request.getQueryString());
        this.httpRequestService.fetchToResponse(null, null, printOutputUrl,
                endPointUrl, request, response, false, null, null);
    }

    /**
     * Proxy extract data request to given endpoint.
     *
     * @param serviceEndpoint Service specific endpoint.
     * @param request HTTP request interface.
     * @param response HttpServletResponse where to write the proxy-response.
     */
    public void getExtractRequest(String serviceEndpoint, HttpServletRequest request,
            HttpServletResponse response) {
        String endPointUrl = proxyService
                .getEndpointUrl(extractServiceUrl, serviceEndpoint, request.getQueryString());
        List<NameValuePair> editedParams = null;
        if (request.getParameterMap().containsKey("Layers_to_Clip")) {
            editedParams = KsrGeoprocessingUtils.createExtractParams(request, layerService);
        }
        httpRequestService.fetchToResponse(null, null, extractServiceUrl,
                endPointUrl, request, response, false, editedParams, null);
    }

    /**
     * Proxy extract output to given endpoint.
     *
     * @param serviceEndpoint Service specific endpoint.
     * @param request HTTP request interface.
     * @param response HttpServletResponse where to write the proxy-response
     */
    public void getExtractOutput(String serviceEndpoint, HttpServletRequest request,
            HttpServletResponse response) {
        String endPointUrl = proxyService
                .getEndpointUrl(extractOutputUrl, serviceEndpoint, request.getQueryString());
        this.httpRequestService.fetchToResponse(null, null, extractOutputUrl,
                endPointUrl, request, response, false, null, null);
    }
}
