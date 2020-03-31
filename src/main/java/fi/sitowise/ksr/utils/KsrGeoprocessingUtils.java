package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.LayerAction;
import fi.sitowise.ksr.exceptions.KsrApiException;
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
        JSONObject customPrintParameters = new JSONObject();
        JSONParser parser = new JSONParser();
        Map<String, String[]> queryParams = request.getParameterMap();

        for (Map.Entry<String, String[]> entry : queryParams.entrySet()) {
            for (String value : entry.getValue()) {
                if (entry.getKey().equals("Web_Map_as_JSON")) {
                    webMapAsJson.put("Web_Map_as_JSON", value);
                } else if (entry.getKey().equals("customPrintParameters")) {
                    customPrintParameters.put("customPrintParameters", value);
                } else {
                    params.add(new BasicNameValuePair(entry.getKey(), value));
                }
            }
        }

        webMapAsJson = (JSONObject) parser.parse(webMapAsJson.get("Web_Map_as_JSON").toString());
        JSONArray requestLayers = (JSONArray) (webMapAsJson != null ? webMapAsJson.get("operationalLayers") : null);
        JSONObject layoutOptions =  (webMapAsJson != null ? (JSONObject) webMapAsJson.get("layoutOptions") : null);

        customPrintParameters = (JSONObject) parser.parse(customPrintParameters.get("customPrintParameters").toString());
        JSONArray requestSelectedLayers = (JSONArray) (customPrintParameters != null ? customPrintParameters.get("layers") : null);

        if (layoutOptions != null && customPrintParameters != null) {
            Object attributionsObject = customPrintParameters.get("attributions");

            JSONObject attributions = new JSONObject();
            attributions.put("AttributionsElement", attributionsObject);

            JSONArray customTextElements = new JSONArray();
            customTextElements.add(attributions);

            layoutOptions.put("customTextElements", customTextElements);
        }

        if (requestLayers != null) {
            for (Object entry : requestLayers) {
                if (((JSONObject) entry).get("url") != null) {
                    String layerId = KsrStringUtils.replaceSearchId(((JSONObject) entry).get("id").toString());
                    Layer layer = fetchLayer(layerId, layerService);
                    String url = layer.getUrl();
                    ((JSONObject) entry).replace("url", url);

                    /* Custom highlighting for selected features on print 
                    because current ArcgisJS API version (4.13) doesn't support this yet. */
                    if (requestSelectedLayers != null) {
                        for (Object selectedLayer : requestSelectedLayers) {
                            if (((JSONObject) selectedLayer).get("layerId").equals(((JSONObject) entry).get("id"))) {
                                ((JSONObject) entry).put("selectionObjectIds", ((JSONObject) selectedLayer).get("objectIds"));
                            }
                        }
                    }
                }
            }
        }
        params.add(new BasicNameValuePair("Web_Map_as_JSON", webMapAsJson != null ? webMapAsJson.toString() : null));

        return params;
    }

    /**
     * Create edited parameters from request queryString or form parameters to be used in
     * feature extract.
     *
     * @param request HTTPServletRequest that contains queryString and query parameters.
     * @param layerService LayerService for getting layer name.
     * @return Edited parameter list with layer name instead of id.
     */
    public static List<NameValuePair> createExtractParams(HttpServletRequest request,
            LayerService layerService) {
        List<NameValuePair> params = new ArrayList<>();
        Map<String, String[]> queryParams = request.getParameterMap();
        String layersToClip = null;

        for (Map.Entry<String, String[]> entry : queryParams.entrySet()) {
            for (String value : entry.getValue()) {
                if (entry.getKey().equals("Layers_to_Clip")) {
                    layersToClip = value;
                } else {
                    params.add(new BasicNameValuePair(entry.getKey(), value));
                }
            }
        }

        if (layersToClip != null) {
            Layer layer = fetchLayer(layersToClip, layerService);
            String layerName = String.format("[\"%s\"]", layer.getLayers());
            params.add(new BasicNameValuePair("Layers_to_Clip", layerName));
        }

        return params;
    }

    /**
     * Fetch layer from database with the given layer id.
     *
     * @param layerId Identifier of the layer.
     * @param layerService LayerService for fetching the layer.
     * @return Layer details or throw NotFoundErrorException if user does not have read
     * permissions for the layer or layer can't be found with the given id.
     */
    private static Layer fetchLayer(String layerId, LayerService layerService) {
        Integer id = Integer.parseInt(layerId);
        Layer layer = layerService.getLayer(id, false, LayerAction.READ_LAYER);
        if (layer == null) {
            throw new KsrApiException.NotFoundErrorException("No layer can be found.");
        }
        return layer;
    }
}
