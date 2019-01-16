package fi.sitowise.ksr.domain.esri;

import com.fasterxml.jackson.databind.ObjectMapper;
import fi.sitowise.ksr.exceptions.KsrApiException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

/**
 * A POJO representing response FeatureService query -response, if queried with objectId only.
 */
public class QueryFeature {
    private Feature feature;

    /**
     * Get the feature.
     *
     * @return The feature.
     */
    public Feature getFeature() {
        return feature;
    }

    /**
     * Set the feature.
     * @param feature The feature.
     */
    public void setFeature(Feature feature) {
        this.feature = feature;
    }

    /**
     * De-serializes responses InputStream into an Query -object.
     *
     * @param is InputStream to deserialize.
     * @return EsriQueryFeature -object.
     */
    public static QueryFeature fromInputStream(InputStream is) {
        ObjectMapper om = new ObjectMapper();
        try {
            return om.readValue(is, QueryFeature.class);
        } catch (IOException e) {
            throw new KsrApiException.InternalServerErrorException("Error de-serializing response from FeatureService", e);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        } else if (!(o instanceof QueryFeature)) {
            return false;
        }

        QueryFeature qf = (QueryFeature) o;

        return Objects.equals(qf.feature, feature);
    }
}
