package fi.sitowise.ksr.service;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.utils.KsrAuthenticationUtils;
import fi.sitowise.ksr.utils.ktj.KTJUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.geojson.FeatureCollection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Base64;

/**
 * A Service to make Requests to Maanmittauslaitos Kiinteistötietojärjestelmä (KTJ).
 */
@Service
public class KTJService {

    private static final Logger log = LogManager.getLogger(KTJService.class);

    private final String NUMERIC_IDENTIFIER_PATTERN = "^([0-9]{14})$";
    private final String HYPHEN_IDENTIFIER_PATTERN = "^([0-9]{1,3}-[0-9]{1,3}-[0-9]{1,4}-[0-9]{1,4})$";

    private final String KTJ_WFS_POINT = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<wfs:GetFeature xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1.0\" xsi:schemaLocation=\"http://www.opengis.net/wfs  http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">" +
            "<wfs:Query typeName=\"ktjkiiwfs:RekisteriyksikonTietoja\">" +
            "<ogc:Filter>" +
            "<ogc:Intersects>" +
            "<ogc:PropertyName>ktjkiiwfs:rekisteriyksikonPalstanTietoja/ktjkiiwfs:RekisteriyksikonPalstanTietoja/ktjkiiwfs:sijainti</ogc:PropertyName>" +
            "<gml:Point>" +
            "<gml:pos>%f %f</gml:pos>" +
            "</gml:Point>" +
            "</ogc:Intersects>" +
            "</ogc:Filter>" +
            "</wfs:Query>" +
            "</wfs:GetFeature>";

    private final String KTJ_WFS_PROPERTY_IDENTIFIER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<wfs:GetFeature xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1.0\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">" +
            "<wfs:Query typeName=\"ktjkiiwfs:RekisteriyksikonTietoja\" srsName=\"EPSG:3067\">" +
            "<ogc:Filter>" +
            "<ogc:PropertyIsEqualTo>" +
            "<ogc:PropertyName>ktjkiiwfs:kiinteistotunnus</ogc:PropertyName>" +
            "<ogc:Literal>%s</ogc:Literal>" +
            "</ogc:PropertyIsEqualTo>" +
            "</ogc:Filter>" +
            "</wfs:Query>" +
            "</wfs:GetFeature>";

    private final HttpRequestService httpRequestService;

    @Value("${ktj.endpoint}")
    String ktjEndpointUrl;

    @Value("${ktj.username}")
    String ktjUsername;

    @Value("${ktj.password}")
    String ktjPassword;

    public KTJService (HttpRequestService httpRequestService) {
        this.httpRequestService = httpRequestService;
    }

    /**
     * Gets a FeatureCollection of KTJ-response for given propertyIdentifier.
     *
     * Property identifier stands for "Kiinteistötunnus".
     *
     * @param propertyIdentifier Property identifier to query.
     * @return FeatureCollection representing found property.
     */
    public FeatureCollection getPropertyDetails(String propertyIdentifier) {
        if (propertyIdentifier == null) {
            throw new KsrApiException.BadRequestException("Invalid parameter \"propertyIdentifier\" cannot be null.");
        } else if (
                !propertyIdentifier.matches(HYPHEN_IDENTIFIER_PATTERN) &&
                !propertyIdentifier.matches(NUMERIC_IDENTIFIER_PATTERN)) {
             throw new KsrApiException.BadRequestException("Invalid parameter \"propertyIdentifier\" invalid format.");
        }

        log.info(String.format(
                "Get property details: [%s]. User: [%s]",
                propertyIdentifier, KsrAuthenticationUtils.getCurrentUsername()
        ));
        return fetchDetails(String.format(KTJ_WFS_PROPERTY_IDENTIFIER, propertyIdentifier));
    }

    /**
     * Gets a FeatureCollection of KTJ-response for given coordinates.
     *
     * Coordinates must be given in EPSG:3067 spatial reference system.
     *
     * @param x X coordinate.
     * @param y Y coordinate.
     * @return FeatureCollection representing found property.
     */
    public FeatureCollection getPropertyDetails(Double x, Double y) {
        if (x == null || y == null) {
            throw new KsrApiException.BadRequestException("Invalid parameters. Both x and y must be defined.");
        }

        log.info(String.format(
                "Get property details: x: [%f], y: [%f]. User: [%s]",
                x, y, KsrAuthenticationUtils.getCurrentUsername()
        ));
        return fetchDetails(String.format(KTJ_WFS_POINT, x, y));
    }

    /**
     * A Helper method to invoke a HTTP POST -call to KTJ-endpoint, and finally return FeatureCollection parsed from
     * response.
     *
     * @param body Raw body that should be POSTed into KTJ-endpoint.
     * @return FeatureCollection.
     */
    private FeatureCollection fetchDetails(String body) {
        final String authentication = getBasicAuthString();
        final InputStream is = httpRequestService.postURLContents(
                ktjEndpointUrl,
                body,
                authentication,
                "text/xml",
                true
        );
        return KTJUtils.parseKTJResponse(is);
    }

    /**
     * Formats plain text username and password into HTTP Basic Auth compatible username:password -string and encodes
     * it with Base64.
     *
     * @return Base64 encoded username:password String for HTTP Basic Auth.
     */
    private String getBasicAuthString() {
        return Base64.getEncoder().encodeToString(String.format("%s:%s", ktjUsername, ktjPassword).getBytes());
    }
}
