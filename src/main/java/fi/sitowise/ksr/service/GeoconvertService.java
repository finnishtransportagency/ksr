package fi.sitowise.ksr.service;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.utils.KsrStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Geoconvert service.
 */
@Service
public class GeoconvertService {

    private final HttpRequestService httpRequestService;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Value("${geoconvert.service.url}")
    private String geoConvertServiceUrl;

    @Value("${digitransit.service.url}")
    private String digitransitServiceUrl;

    @Autowired
    public GeoconvertService(HttpRequestService httpRequestService) {
        this.httpRequestService = httpRequestService;
    }

    /**
     * Converts y and x coordinates to address.
     *
     * @param request HTTP request interface.
     * @param response HTTP response where to write the fetch response.
     * @param featureType Type of feature. Can be either road, street, water or railway.
     * @param y Points y coordinate.
     * @param x Points x coordinate.
     */
    public void getConvertedData(HttpServletRequest request, HttpServletResponse response, String featureType, String y, String x) {
        String urlToFetch;

        switch (featureType) {
            case "road":
                urlToFetch = KsrStringUtils.replaceMultipleSlashes(String.format("%s/reversegeocode?y=%s&x=%s", geoConvertServiceUrl, y, x));
                break;
            case "road2":
                urlToFetch = KsrStringUtils.replaceMultipleSlashes(String.format("%s/tieosoite?y=%s&x=%s", geoConvertServiceUrl, y, x));
                break;
            case "street":
                urlToFetch = KsrStringUtils.replaceMultipleSlashes(String.format("%s/geocoding/v1/reverse?point.lat=%s&point.lon=%s&size=1", digitransitServiceUrl, y, x));
                break;
            case "railway":
                urlToFetch = KsrStringUtils.replaceMultipleSlashes(String.format("%s/rataosoite?x=%s&y=%s", geoConvertServiceUrl, x, y));
                break;
            case "railway2":
                urlToFetch = KsrStringUtils.replaceMultipleSlashes(String.format("%s/rataosoite?x=%s&y=%s", geoConvertServiceUrl, x, y));
                break;
            default:
                throw new KsrApiException.BadRequestException("Invalid query parameters given.");
        }

        this.httpRequestService.fetchToResponse(null, null, null, urlToFetch, request, response, true, null, null);
    }
}
