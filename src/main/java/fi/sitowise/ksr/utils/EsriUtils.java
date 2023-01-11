package fi.sitowise.ksr.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fi.sitowise.ksr.exceptions.KsrApiException;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

@Component
public class EsriUtils {

    /**
     * A Helper method to create List of common query-parameters. Query-parameters are compatible with ArcGIS
     * Feature Service.
     *
     * @param outFields Names of the fields-to return. * (asterisk) means that all fields should be returned.
     * @return List of query-parameters.
     */
    public static List<NameValuePair> createBasicQueryParams(String outFields) {
        if (outFields == null) {
            outFields = "*";
        }
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "pjson"));
        params.add(new BasicNameValuePair("returnGeometry", "false"));
        params.add(new BasicNameValuePair("outFields", outFields));
        return params;
    }

    /**
     * Creates an url from base-url and query-parameters.
     *
     * @param baseUrl Base-url. Adds query-parameters after the base-url.
     * @param params Query-parameters.
     * @return  Url as a combination of base-url and query-parameters.
     */
    public static String createUrl(String baseUrl, List<NameValuePair> params) {
        try {
            URL url = new URL(baseUrl);

            URIBuilder builder = new URIBuilder();
            builder.setScheme(url.getProtocol());
            builder.setHost(url.getHost());
            if (url.getPort() > 0) builder.setPort(url.getPort());
            builder.setPath(
                    KsrStringUtils.replaceMultipleSlashes(
                            String.format("%s/%s", url.getPath(), "query")
                    )
            );
            if (params != null) {
                builder.setParameters(params);
            }
            return builder.toString();

        } catch (MalformedURLException e) {
            throw new KsrApiException.InternalServerErrorException(
                    String.format("Error fetching contracts. Error reading layer-url. Url: [%s]", baseUrl),
                    e
            );
        }
    }

    /**
     * Return value from layerdefinition for given key.
     *
     * @param is InputStream to read the value.
     * @param key Key for the value.
     * @return Optional String possibly containing objectIdFieldName.
     */
    public static Optional<Object> getLayerDefinitionValue(InputStream is, String key) {
        ObjectMapper om = new ObjectMapper();
        try {
            TypeReference<HashMap<String, Object>> typeReference = new TypeReference<HashMap<String, Object>>() {};
            HashMap<String, Object> layerDefinition = om.readValue(is, typeReference);
            if (layerDefinition != null) {
                Object value = layerDefinition.get(key);
                return Optional.ofNullable(value);
            }
            return Optional.empty();
        } catch (IOException e) {
            throw new KsrApiException.InternalServerErrorException("Error reading layer-definition.", e);
        }
    }
}
