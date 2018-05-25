package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;

@Service
public class ProxyService {

    @Autowired
    private HttpRequestService httpRequestService;

    public String getEndpointUrl(MapLayer mapLayer, String serviceEndpoint, String queryString) {
        String mlUrl = mapLayer.getUrl();

        StringBuilder urlBuilder = new StringBuilder(mlUrl);
        // Also ensure that there is a slash between those two url base parts.
        urlBuilder.append(mlUrl.substring(mlUrl.length() - 1).equals("/") ? "" : "/");
        urlBuilder.append(serviceEndpoint);
        if (queryString != null && queryString.length() > 0) {
            urlBuilder.append("?");
            urlBuilder.append(queryString);
        }

        return urlBuilder.toString();
    }

    public void get(MapLayer mapLayer, String baseUrl, String queryString, String method, String serviceEndpoint, HttpServletResponse response) {
        String endPointUrl = getEndpointUrl(mapLayer, serviceEndpoint, queryString);
        httpRequestService.fetchToResponse(mapLayer, baseUrl, method, endPointUrl, response);
    }
}
