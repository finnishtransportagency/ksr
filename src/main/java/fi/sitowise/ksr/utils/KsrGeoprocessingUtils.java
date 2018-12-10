package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.service.LayerService;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class KsrGeoprocessingUtils {

    /**
     * Creates edited parameters from request queryString or parameters to be used for printing.
     *
     * @param request HTTPServletRequest that contains queryString and query parameters.
     * @param layerService LayerService for getting layer URL.
     * @return Edited parameter list without Web_Map_as_JSON.
     */
    public static List<NameValuePair> createPrintParams(HttpServletRequest request,
            LayerService layerService) throws ParseException {
        List<NameValuePair> params = new ArrayList<>();
        JSONObject webMapAsJson = new JSONObject();
        JSONParser parser = new JSONParser();
        Map<String, String[]> queryParams = request.getParameterMap();

        for (Map.Entry<String, String[]> entry : queryParams.entrySet()) {
            for (String value : entry.getValue()) {
                if (entry.getKey().equals("Web_Map_as_JSON")) {
                    webMapAsJson.put("Web_Map_as_JSON", value);
                } else {
                    params.add(new BasicNameValuePair(entry.getKey(), value));
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
                    Layer layer = layerService.getLayer(id, false, LayerAction.READ_LAYER);
                    String url = layer.getUrl();
                    ((JSONObject) entry).replace("url", url);
                }
            }
        }
        params.add(new BasicNameValuePair("Web_Map_as_JSON", webMapAsJson != null ? webMapAsJson.toString() : null));

        return params;
    }
}
