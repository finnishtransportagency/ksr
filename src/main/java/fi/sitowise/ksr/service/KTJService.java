package fi.sitowise.ksr.service;

import fi.sitowise.ksr.controller.KTJController;
import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.utils.KsrAuthenticationUtils;
import fi.sitowise.ksr.utils.KsrStringUtils;
import fi.sitowise.ksr.utils.ktj.KTJUtils;
import org.apache.http.client.utils.URIBuilder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.geojson.FeatureCollection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.*;

/**
 * A Service to make Requests to Maanmittauslaitos Kiinteistötietojärjestelmä (KTJ).
 */
@Service
public class KTJService {

    private static final Logger log = LogManager.getLogger(KTJService.class);

    public static final String NUMERIC_IDENTIFIER_PATTERN = "^([0-9]{14})$";
    public static final String HYPHEN_IDENTIFIER_PATTERN = "^([0-9]{1,3}-[0-9]{1,3}-[0-9]{1,4}-[0-9]{1,4})$";

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

    private final String KTJ_WFS_POLYGON = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<wfs:GetFeature version=\"1.1.0\" xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">" +
            "<wfs:Query typeName=\"ktjkiiwfs:RekisteriyksikonTietoja\" srsName=\"EPSG:3067\">" +
            "<ogc:Filter>" +
            "<ogc:Intersects>" +
            "<ogc:PropertyName>ktjkiiwfs:rekisteriyksikonPalstanTietoja/ktjkiiwfs:RekisteriyksikonPalstanTietoja/ktjkiiwfs:sijainti</ogc:PropertyName>" +
            "<gml:Polygon>" +
            "<gml:exterior>" +
            "<gml:LinearRing>" +
            "<gml:posList>%s</gml:posList>" +
            "</gml:LinearRing>" +
            "</gml:exterior>" +
            "</gml:Polygon>" +
            "</ogc:Intersects>" +
            "</ogc:Filter>" +
            "</wfs:Query>" +
            "</wfs:GetFeature>";

    private final HttpRequestService httpRequestService;

    @Value("${spring.servlet.context-path:/}")
    String contextPath;

    @Value("${ktj.endpoint}")
    String ktjEndpointUrl;

    @Value("${ktj.deedEndpoint}")
    String ktjDeedEndpointUrl;

    @Value("${ktj.easementEndpoint}")
    String ktjEasementEndpointUrl;

    @Value("${ktj.mapEndpoint.xml}")
    String ktjMapEndpointXml;

    @Value("${ktj.mapEndpoint.url}")
    String ktjMapEndpointUrl;

    @Value("${ktj.registerUnitEndpoint}")
    String ktjRegisterUnitEndpointUrl;

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
     * Gets a FeatureCollection of KTJ-response for given polygon.
     *
     * Coordinates must be given in EPSG:3067 spatial reference system.
     *
     * @param polygon polygon coordinates.
     * @return FeatureCollection representing found property.
     */
    public FeatureCollection getPropertyDetailsArea(String polygon) {
        if (polygon == null) {
            throw new KsrApiException.BadRequestException("Invalid parameters. polygon must be defined.");
        }

        log.info(
                "Get property details: polygon: [%f]. User: [%s]",
                polygon, KsrAuthenticationUtils.getCurrentUsername()
        );
        return fetchDetails(String.format(KTJ_WFS_POLYGON, polygon.replaceAll(",", "")));
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

    /**
     * Get PDF print links for given property.
     *
     * @param propertyIdentifier Property's identifier.
     * @param language Language of the prints.
     * @return A map containing List of parameter maps to different types of PDF prints.
     */
    public Map<String, List<String>> getPropertyPdfLinks(String propertyIdentifier, String language) {
        log.info(String.format(
                "Get PDF print links for property: [%s] User: [%s]",
                propertyIdentifier, KsrAuthenticationUtils.getCurrentUsername()
        ));

        Map<String, List<String>> pdfLinkMap = new HashMap<>();

        String deedUrl = KsrStringUtils.replaceMultipleSlashes(
            String.format(
                "/%s/%s/pdf/deed?kiinteistotunnus=%s&lang=%s",
                contextPath,
                KTJController.ENDPOINT_URL,
                propertyIdentifier,
                language.toUpperCase()
            )
        );
        pdfLinkMap.put("deed", Arrays.asList(deedUrl));

        String easementUrl = KsrStringUtils.replaceMultipleSlashes(
            String.format(
                "/%s/%s/pdf/easement?kiinteistotunnus=%s&lang=%s",
                contextPath,
                KTJController.ENDPOINT_URL,
                propertyIdentifier,
                language.toUpperCase()
            )
        );
        pdfLinkMap.put("easement", Arrays.asList(easementUrl));

        String registerUnitUrl = KsrStringUtils.replaceMultipleSlashes(
            String.format(
                "/%s/%s/pdf/registerunit?kiinteistotunnus=%s&lang=%s",
                contextPath,
                KTJController.ENDPOINT_URL,
                propertyIdentifier,
                language.toUpperCase()
            )
        );
        pdfLinkMap.put("registerunit", Arrays.asList(registerUnitUrl));

        String xmlUrl = String.format("%s?rekisteriyksikko=%s&lang=%s",
                ktjMapEndpointXml, propertyIdentifier, language.toUpperCase());
        InputStream xmlInputStream = httpRequestService.getURLContents(xmlUrl, true,
                getBasicAuthString());
        pdfLinkMap.put("map", KTJUtils.parseKTJPdfLinks(contextPath, xmlInputStream));

        return pdfLinkMap;
    }

    /**
     * Get PDF print from given url.
     *
     * @param printType Type of the print to be fetched.
     * @param request Http servlet request of incoming request.
     * @param response Http servlet interface to which the response is written.
     */
    public void getPropertyPdfPrint(String printType, HttpServletRequest request, HttpServletResponse response) {
        String filename;
        String pdfUrl;
        URIBuilder uri;
        try {
            switch (printType) {
                case "deed":
                    filename = "lainhuutotodistus.pdf";
                    uri = new URIBuilder(ktjDeedEndpointUrl);
                    break;
                case "easement":
                    filename = "rasitustodistus.pdf";
                    uri = new URIBuilder(ktjEasementEndpointUrl);
                    break;
                case "map":
                    filename = "karttaote.pdf";
                    uri = new URIBuilder(ktjMapEndpointUrl);
                    break;
                case "registerunit":
                    filename = "kiinteistorekisteriote.pdf";
                    uri = new URIBuilder(ktjRegisterUnitEndpointUrl);
                    break;
                default:
                    throw new KsrApiException.BadRequestException("Invalid print type.");
            }

            for (String paramName: Collections.list(request.getParameterNames())) {
                uri.setParameter(paramName, request.getParameter(paramName));
            }

            pdfUrl = uri.build().toString();
        } catch (URISyntaxException ue) {
            throw new KsrApiException.InternalServerErrorException("Error building pdf-url.", ue);
        }
        log.info(String.format(
                "Get [%s] PDF print with url: [%s] User: [%s]",
                printType, pdfUrl, KsrAuthenticationUtils.getCurrentUsername()
        ));
        InputStream inputStream = httpRequestService.getURLContents(pdfUrl, false, getBasicAuthString());

        try {
            String headerValue = String.format("inline; filename=\"%s\"", filename);
            response.setHeader("Content-Disposition", headerValue);
            response.setContentType("application/pdf");
            StreamUtils.copy(inputStream, response.getOutputStream());
        } catch (IOException e) {
            throw new KsrApiException.InternalServerErrorException("Failed to get PDF print.", e);
        }
    }
}
