package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.service.LayerService;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

@SuppressWarnings("unchecked")
public class KsrPrintUtils {

    /**
     * Creates edited parameters from request queryString or parameters to be used for printing
     *
     * @param request HTTPServletRequest that contains queryString and query parameters
     * @param serviceEndpoint HTTPServletRequest that contains queryString and query parameters
     * @param layerService LayerService for getting layer URL
     * @return edited List without Web_Map_as_JSON
     */
    public static List<NameValuePair> createEditedParams(HttpServletRequest request, String serviceEndpoint, LayerService layerService) throws ParseException {
        List<NameValuePair> params = new ArrayList<>();
        JSONObject webMapAsJson = new JSONObject();
        JSONParser parser = new JSONParser();

        switch (request.getMethod()) {
            case "GET":
                Map<String, String> query_pairs = new HashMap<>();
                String query = request.getQueryString();
                String[] pairs = query.split("&");
                for (String pair : pairs) {
                    int idx = pair.indexOf("=");
                    try {
                        query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }

                for (Map.Entry<String, String> entry : query_pairs.entrySet()) {
                    if (entry.getKey().equals("Web_Map_as_JSON")) {
                        webMapAsJson.put("Web_Map_as_JSON", entry.getValue());
                    } else {
                        params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
                    }
                }
                break;
            case "POST":
                for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
                    for (String value : entry.getValue()) {
                        if (entry.getKey().equals("Web_Map_as_JSON")) {
                            webMapAsJson.put("Web_Map_as_JSON", value);
                        } else {
                            params.add(new BasicNameValuePair(entry.getKey(), value));
                        }
                    }
                }
        }

        webMapAsJson = (JSONObject) parser.parse(webMapAsJson.get("Web_Map_as_JSON").toString());
        JSONArray requestLayers = (JSONArray) (webMapAsJson != null ? webMapAsJson.get("operationalLayers") : null);

        if (requestLayers != null) {
            for (Object entry : requestLayers) {
                if (((JSONObject) entry).get("url") != null) {
                    String layerId = KsrStringUtils.replaceSearchId(((JSONObject) entry).get("id").toString());
                    Integer id = Integer.parseInt(layerId);
                    Layer layer = layerService.getLayer(id, StringUtils.isNotEmpty(serviceEndpoint) && serviceEndpoint.equals("query"));
                    String url = layer.getUrl();
                    ((JSONObject) entry).replace("url", url);
                }
            }
        }
        params.add(new BasicNameValuePair("Web_Map_as_JSON", webMapAsJson != null ? webMapAsJson.toString() : null));

        return params;
    }
}
