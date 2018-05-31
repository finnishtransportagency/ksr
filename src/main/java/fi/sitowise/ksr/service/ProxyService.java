package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;

import fi.sitowise.ksr.utils.KsrStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;

/**
 * A proxy service for contructing URL:s from
 * client defined query parameters and database stored maplayer -configuration.
 */
@Service
public class ProxyService {

    @Autowired
    private HttpRequestService httpRequestService;

    /**
     * Constructs a valid final URL by combining the maplayers original URL with serviceEndpoint and
     * queryString picked from incoming request.
     *
     * @param mapLayer The maplayer that is requested
     * @param serviceEndpoint Service specific endpoint, after mapLayers base url.
     * @param queryString HTTP queryString without leading ?, separated by &
     * @return A valid final URL
     */
    public String getEndpointUrl(MapLayer mapLayer, String serviceEndpoint, String queryString) {
        String mlUrl = mapLayer.getUrl();

        StringBuilder urlBuilder = new StringBuilder();
        // Also ensure that there is a slash between those two url base parts.
        if (mlUrl.endsWith("/")) {
            if (serviceEndpoint == null || serviceEndpoint.isEmpty() || serviceEndpoint.equals("/")) {
                urlBuilder.append(mlUrl.substring(0, mlUrl.length() - 1));
            } else {
                urlBuilder.append(mlUrl);
                urlBuilder.append(KsrStringUtils.removeTrailingSlash(serviceEndpoint));
            }
        } else {
            if (serviceEndpoint == null || serviceEndpoint.isEmpty() || serviceEndpoint.equals("/")) {
                urlBuilder.append(mlUrl);
            } else {
                urlBuilder.append(mlUrl);
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
     * @param mapLayer The maplayer that is requested
     * @param baseUrl Baseurl for proxy-service for given layer.
     * @param queryString HTTP queryString without leading ?, separated by &
     * @param method HTTP method, GET | POST | PUT etc.
     * @param serviceEndpoint Service specific endpoint, after mapLayers base url.
     * @param response HttpServletResponse where to write the proxy-response
     */
    public void get(MapLayer mapLayer, String baseUrl, String queryString, String method, String serviceEndpoint, HttpServletResponse response) {
        String endPointUrl = getEndpointUrl(mapLayer, serviceEndpoint, queryString);
        httpRequestService.fetchToResponse(mapLayer, baseUrl, method, endPointUrl, response);
    }
}
