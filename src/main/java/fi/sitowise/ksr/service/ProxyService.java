package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.MapLayer;

import fi.sitowise.ksr.utils.KsrStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;

@Service
public class ProxyService {

    @Autowired
    private HttpRequestService httpRequestService;

    public String getEndpointUrl(MapLayer mapLayer, String serviceEndpoint, String queryString) {
        String mlUrl = mapLayer.getUrl();

        StringBuilder urlBuilder = new StringBuilder();
        // Also ensure that there is a slash between those two url base parts.
        if (mlUrl.endsWith("/")) {
            if (serviceEndpoint == null || serviceEndpoint.isEmpty() || serviceEndpoint.equals("/")) {
                urlBuilder.append(mlUrl.substring(0, mlUrl.length() - 1));
            }
            else {
                urlBuilder.append(mlUrl);
                urlBuilder.append(KsrStringUtils.withoutTrailingSlash(serviceEndpoint));
            }
        }
        else {
            if (serviceEndpoint == null || serviceEndpoint.isEmpty() || serviceEndpoint.equals("/")) {
                urlBuilder.append(mlUrl);
            }
            else {
                urlBuilder.append(mlUrl);
                urlBuilder.append("/");
                urlBuilder.append(KsrStringUtils.withoutTrailingSlash(serviceEndpoint));
            }
        }

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
