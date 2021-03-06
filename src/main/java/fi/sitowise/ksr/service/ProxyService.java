package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A proxy service for contructing URL:s from
 * client defined query parameters and database stored maplayer -configuration.
 */
@Service
public class ProxyService {

    private final HttpRequestService httpRequestService;
    private final AESService aesService;

    @Autowired
    public ProxyService(HttpRequestService httpRequestService, AESService aesService) {
        this.httpRequestService = httpRequestService;
        this.aesService = aesService;
    }

    /**
     * Constructs a valid final URL by combining the maplayers original URL with serviceEndpoint and
     * queryString picked from incoming request.
     *
     * @param layerUrl The layer URL that is requested
     * @param serviceEndpoint Service specific endpoint, after mapLayers base url.
     * @param queryString HTTP queryString without leading ?, separated by &
     * @return A valid final URL
     */
    public String getEndpointUrl(String layerUrl, String serviceEndpoint, String queryString) {
        StringBuilder urlBuilder = new StringBuilder();
        // Also ensure that there is a slash between those two url base parts.
        if (layerUrl.endsWith("/")) {
            if (serviceEndpoint == null || serviceEndpoint.isEmpty() || serviceEndpoint.equals("/")) {
                urlBuilder.append(layerUrl, 0, layerUrl.length() - 1);
            } else {
                urlBuilder.append(layerUrl);
                urlBuilder.append(KsrStringUtils.removeTrailingSlash(serviceEndpoint));
            }
        } else {
            if (serviceEndpoint == null || serviceEndpoint.isEmpty() || serviceEndpoint.equals("/")) {
                urlBuilder.append(layerUrl);
            } else {
                urlBuilder.append(layerUrl);
                urlBuilder.append("/");
                urlBuilder.append(KsrStringUtils.removeTrailingSlash(serviceEndpoint));
            }
        }

        if (queryString != null && queryString.length() > 0) {
            urlBuilder.append("?");
            urlBuilder.append(queryString);
        }

        return urlBuilder.toString();
    }

    /**
     * Proxy a HTTP-request into given endpoint.
     *
     * @param layer The layer that is requested
     * @param baseUrl Baseurl for proxy-service for given layer.
     * @param serviceEndpoint Service specific endpoint, after mapLayers base url.
     * @param request HTTP request interface.
     * @param response HttpServletResponse where to write the proxy-response
     */
    public void get(Layer layer, String baseUrl, String serviceEndpoint, HttpServletRequest request,
                    HttpServletResponse response, LayerAction action) {
        String endPointUrl = getEndpointUrl(layer.getUrl(), serviceEndpoint, request.getQueryString());
        String authentication = aesService.decrypt(layer.getAuthentication());
        this.httpRequestService.fetchToResponse(layer, authentication, baseUrl, endPointUrl,
                request, response, layer.getUseInternalProxy(), null, action);
    }
}
