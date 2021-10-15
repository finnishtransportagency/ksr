package fi.sitowise.ksr.service;

import fi.sitowise.ksr.domain.Layer;
import fi.sitowise.ksr.domain.esri.EditResponse;
import fi.sitowise.ksr.domain.esri.Feature;
import fi.sitowise.ksr.domain.esri.Response;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.repository.LayerRepository;
import fi.sitowise.ksr.utils.shj.KayttooikeussopimusFieldNames;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpHost;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIUtils;
import org.apache.http.message.BasicNameValuePair;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

@Service
public class SHJService {

    private final LayerRepository layerRepository;

    private final HttpRequestService httpRequestService;

    public SHJService(LayerRepository layerRepository, HttpRequestService httpRequestService) {
        this.layerRepository = layerRepository;
        this.httpRequestService = httpRequestService;
    }

    /**
     * Add new feature to layer Käyttöoikeussopimukset.
     *
     * @param attributes Attributes retrieved via API.
     * @throws URISyntaxException if could not create URI to ArcGis-server.
     * @throws IOException if could not open http response.
     */
    public boolean addFeature (Map<String, Object> attributes) throws URISyntaxException, IOException {
        Layer layer = getKayttooikeussopimuksetLayer();
        Map<String, Object> fields = convertNamesShjToKsr(attributes);
        String sopnum = (String) fields.get(KayttooikeussopimusFieldNames.SOPIMUSNUM.getKsrName());

        if (sopnum == null) {
            throw new KsrApiException.BadRequestException(String.format("Required value %s is missing.",
                    KayttooikeussopimusFieldNames.SOPIMUSNUM.getShjName()));
        }

        Optional<String> getFeaturesUrl = layer.getGetFeaturesUrl("SOPIMUSNUM", sopnum);
        if (!getFeaturesUrl.isPresent()) {
            throw new KsrApiException.InternalServerErrorException("Unexpected error occurred.");
        }
        InputStream is = httpRequestService.getURLContents(getFeaturesUrl.get(),
                layer.getUseInternalProxy(),
                layer.getAuthentication());
        Response response = Response.fromInputStream(is, layer.getId());
        if (response.getFeatures().size() > 0) {
            throw new KsrApiException.BadRequestException(
                    String.format(
                            "Contract identifier %s already exists.",
                            fields.get(KayttooikeussopimusFieldNames.SOPIMUSNUM.getKsrName()).toString()
                    ));
        }

        String endPointUrl = layer.getUrl() + "/addFeatures";
        EditResponse editResponse = getEditResponse(endPointUrl, fields, layer);
        if (editResponse.getError() != null) {
            throw new KsrApiException.BadRequestException(((ArrayList<String>) editResponse.getError().get("details"))
                    .get(0));
        }

        return editResponse.hasAddSuccess();
    }

    /**
     * Update feature on layer Käyttöoikeussopimukset.
     *
     * @param attributes Attributes retrieved via API.
     * @throws URISyntaxException if could not create URI to ArcGis-server.
     * @throws IOException if could not open http response.
     */
    public boolean updateFeature (Map<String, Object> attributes) throws URISyntaxException, IOException {
        Layer layer = getKayttooikeussopimuksetLayer();
        Map<String, Object> fields = convertNamesShjToKsr(attributes);

        String sopnum = (String) fields.get(KayttooikeussopimusFieldNames.SOPIMUSNUM.getKsrName());
        if (sopnum == null) {
            throw new KsrApiException.BadRequestException(String.format("Required value %s is missing.",
                    KayttooikeussopimusFieldNames.SOPIMUSNUM.getShjName()));
        }

        Optional<String> getFeaturesUrl = layer.getGetFeaturesUrl("SOPIMUSNUM", sopnum);
        if (!getFeaturesUrl.isPresent()) {
            throw new KsrApiException.InternalServerErrorException(
                    "Failed to build url for updating contract data.");
        }
        InputStream is = httpRequestService.getURLContents(getFeaturesUrl.get(),
                layer.getUseInternalProxy(),
                layer.getAuthentication());
        Response response = Response.fromInputStream(is, layer.getId());

        if (response.getFeatures().size() == 0) {
            throw new KsrApiException.NotFoundErrorException(
                    String.format(
                            "Contract with contract number %s not found. Could not update.",
                            fields.get(KayttooikeussopimusFieldNames.SOPIMUSNUM.getKsrName()).toString()
                    ));
        } else if (response.getFeatures().size() > 1) {
            throw new KsrApiException.InternalServerErrorException(
                    String.format(
                            "More than one contract found with contract number %s.",
                            fields.get(KayttooikeussopimusFieldNames.SOPIMUSNUM.getKsrName()).toString()
                    ));
        } else {
            String objectIdField = response.getObjectIdFieldName();
            fields.put(objectIdField, response.getFeatures().get(0).getAttributeValue(objectIdField));
        }

        String endPointUrl = layer.getUrl() + "/updateFeatures";
        EditResponse editResponse = getEditResponse(endPointUrl, fields, layer);
        if (editResponse.getError() != null) {
            throw new KsrApiException.BadRequestException(((ArrayList<String>) editResponse.getError().get("details"))
                    .get(0));
        }

        return editResponse.hasUpdateSuccess();
    }

    /**
     * Send add/update request to ArcGis and return response.
     *
     * @param endPointUrl URL to layer service. Should include addFeatures of updateFeatures in the end.
     * @param fields Map of field names and related values.
     * @param layer Layer to add/update feature into.
     * @return {@link EditResponse} including feedback of the editing operation.
     * @throws URISyntaxException if could not create URI to ArcGis-server.
     * @throws IOException if could not open http response.
     */
    private EditResponse getEditResponse(String endPointUrl, Map<String, Object> fields, Layer layer) throws URISyntaxException, IOException {
        HttpHost target = URIUtils.extractHost(new URI(endPointUrl));
        HttpRequestBase base = buildRequestBase(endPointUrl, fields, layer);


        CloseableHttpResponse cRes = httpRequestService.getCloseableResponse(target, base);
        ObjectMapper mapper = new ObjectMapper();
        EditResponse editResponse = mapper.readValue(cRes.getEntity().getContent(), EditResponse.class);
        cRes.close();
        return editResponse;
    }

    /**
     * Fetch layer with name Käyttöoikeussopimukset.
     *
     * @return fetched layer.
     */
    private Layer getKayttooikeussopimuksetLayer() {
        Layer layer = layerRepository.getLayerByName("Käyttöoikeussopimukset");
        if (layer == null) {
            throw new KsrApiException.NotFoundErrorException("Layer not found.");
        }
        return layer;
    }

    /**
     * Get parsed parameters ready to be sent to ArcGis.
     *
     * @param attributes Attributes to be saved on feature.
     * @return List of name-value-pairs to be sent to ArcGis-server for saving feature.
     */
    private List<NameValuePair> getFeatureParameters(Map<String, Object> attributes) {
        ObjectMapper mapper = new ObjectMapper();
        List<Feature> featuresList = new ArrayList<>();
        Feature feature = new Feature();
        feature.setAttributes(attributes);
        featuresList.add(feature);
        List<NameValuePair> featuresParams = new ArrayList<>();
        try {
            featuresParams.add(new BasicNameValuePair("features", mapper.writeValueAsString(featuresList)));
            featuresParams.add(new BasicNameValuePair("f", "json"));
        } catch (IOException e) {
            throw new KsrApiException.InternalServerErrorException("Could not parse feature attributes.");
        }
        return featuresParams;
    }

    /**
     *  Build HttpRequestBase from url, attributes and layer.
     *
     * @param endPointUrl Url to send request to.
     * @param attributes Feature attributes.
     * @param layer Layer to save feature to.
     * @return Request base.
     */
    private HttpRequestBase buildRequestBase(String endPointUrl, Map<String, Object> attributes, Layer layer) {
        List<NameValuePair> featuresParams = getFeatureParameters(attributes);
        HttpRequestBase base = new HttpPost(endPointUrl);
        ((HttpPost) base).setEntity(new UrlEncodedFormEntity(featuresParams, StandardCharsets.UTF_8));
        httpRequestService.setProxy(base, layer.getUseInternalProxy());
        base.setHeader(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded; charset=utf-8");
        return base;
    }

    private Map<String, Object> convertNamesShjToKsr(Map<String, Object> attributes) {
        Map<String, Object> retVal = new HashMap<>();
        for (String key : attributes.keySet()) {
            if (key.equals(KayttooikeussopimusFieldNames.SOPIMUSNUM.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.SOPIMUSNUM.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.KOHDE.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.KOHDE.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.KAYTTOTARK.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.KAYTTOTARK.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.SAANTOTAPA.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.SAANTOTAPA.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.ALKUPAIVA.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.ALKUPAIVA.getKsrName(),
                        attributes.get(key) != null
                                ? Date.valueOf((String) attributes.get(key))
                                : null
                );
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.LOPPUPAIVA.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.LOPPUPAIVA.getKsrName(),
                        attributes.get(key) != null
                            ? Date.valueOf((String) attributes.get(key))
                            : null
                        );
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.PAATTYMIST.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.PAATTYMIST.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.KORVAUSTAP.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.KORVAUSTAP.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.SOPIMUSTAP.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.SOPIMUSTAP.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.VAYLATYYPPI.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.VAYLATYYPPI.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.MUISTIINPANOT.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.MUISTIINPANOT.getKsrName(),
                        attributes.get(key));
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.VIIMEINEN.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.VIIMEINEN.getKsrName(),
                        attributes.get(key) != null
                                ? Date.valueOf((String) attributes.get(key))
                                : null
                );
                continue;
            }
            if (key.equals(KayttooikeussopimusFieldNames.EDITOIJA.getShjName())) {
                retVal.put(
                        KayttooikeussopimusFieldNames.EDITOIJA.getKsrName(),
                        attributes.get(key));
                continue;
            }
            throw new KsrApiException.BadRequestException(String.format("Unidenfied field name %s.", key));
        }
        if (attributes.get(KayttooikeussopimusFieldNames.VIIMEINEN.getKsrName()) == null) {
            retVal.put(
                    KayttooikeussopimusFieldNames.VIIMEINEN.getKsrName(),
                    Date.valueOf(LocalDate.now())
            );
        }
        return retVal;
    }

}
