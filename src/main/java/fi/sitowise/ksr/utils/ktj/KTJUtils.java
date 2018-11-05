package fi.sitowise.ksr.utils.ktj;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.MultiPolygon;
import org.geojson.Polygon;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPathExpressionException;
import java.io.InputStream;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

/**
 * An utility to work with Maanmittauslaitos Kiinteistötietojäjestelmä (KTJ) WFS -responses.
 */
public class KTJUtils {

    private final static String ALL_REGISTER_UNITS_EL = "//ktjkiiwfs:RekisteriyksikonTietoja";
    private final static String PROPERTY_IDENTIFIER_EL = "ktjkiiwfs:kiinteistotunnus";
    private final static String REGISTER_UNIT_TYPE_EL = "ktjkiiwfs:rekisteriyksikkolaji";
    private final static String NAME_EL = "ktjkiiwfs:nimi";
    private final static String LAND_AREA_EL = "ktjkiiwfs:maapintaala";
    private final static String MUNICIPALITY_NAME_FI_EL = "ktjkiiwfs:kuntaTieto/ktjkiiwfs:KuntaTieto/ktjkiiwfs:nimiSuomeksi";
    private final static String REGISTER_DATE_EL = "ktjkiiwfs:rekisterointipvm";
    private final static String PARCEL_DETAILS_EL = "ktjkiiwfs:rekisteriyksikonPalstanTietoja";
    private final static String PARCEL_LOCATION_EL = "ktjkiiwfs:RekisteriyksikonPalstanTietoja/ktjkiiwfs:sijainti";

    /**
     * Parses a KTJ-responses InputStream into a GeoJSON FeatureCollection.
     *
     * @param is InputStream of KTJ WFS-response.
     * @return GeoJSON FeatureCollection representing properties found in response.
     */
    public static FeatureCollection parseKTJResponse(InputStream is) {
        if (is == null) {
            throw new KsrApiException.InternalServerErrorException("Parameter InputStream cannot be null.");
        }
        try {
            FeatureCollection fc = new FeatureCollection();
            Document doc = XMLUtils.parseDocument(is);
            NodeList registerUnits = XMLUtils.getNodes(doc, ALL_REGISTER_UNITS_EL);
            Stream<Node> nodeStream = IntStream.range(0, registerUnits.getLength()).mapToObj(registerUnits::item);
            List<Feature> features = nodeStream.map(KTJUtils::parseRegisterUnit).collect(Collectors.toList());
            fc.addAll(features);
            return fc;
        } catch (Exception e) {
            throw new KsrApiException.InternalServerErrorException(
                    "Error handling KTJ-response.",
                    e
            );
        }
    }

    /**
     * Parses details of a Register Unit (Rekisteriyksikkö) from a Register Unit Node.
     *
     * @param registerUnit The RegisterUnit Node.
     * @return GeoJSON Feature representing Register Unit.
     */
    private static Feature parseRegisterUnit(Node registerUnit) {
        try {
            Feature feat = new Feature();
            feat.setId(
                    XMLUtils.getNodeContent(
                            registerUnit,
                            PROPERTY_IDENTIFIER_EL
                    )
            );

            feat.setProperty(
                    "propertyIdentifier",
                    XMLUtils.getNodeContent(
                        registerUnit,
                        PROPERTY_IDENTIFIER_EL
                    )
            );

            feat.setProperty(
                    "registerUnitType",
                    XMLUtils.getNodeContent(
                        registerUnit,
                        REGISTER_UNIT_TYPE_EL
                    )
            );

            feat.setProperty(
                    "name",
                    XMLUtils.getNodeContent(
                            registerUnit,
                            NAME_EL
                    )
            );

            feat.setProperty(
                    "landArea",
                    XMLUtils.getNodeContentAsDouble(
                            registerUnit,
                            LAND_AREA_EL
                    )
            );

            feat.setProperty(
                    "municipalityName",
                    XMLUtils.getNodeContent(
                        registerUnit,
                        MUNICIPALITY_NAME_FI_EL
                    )
            );

            feat.setProperty(
                    "registrationDate",
                    XMLUtils.getNodeContent(
                            registerUnit,
                            REGISTER_DATE_EL
                    )
            );

            NodeList parcels = XMLUtils.getNodes(registerUnit, PARCEL_DETAILS_EL);
            feat.setProperty("parcelCount", parcels.getLength());

            MultiPolygon multiGeom = new MultiPolygon();

            Stream<Node> parcelStream = IntStream.range(0, parcels.getLength()).mapToObj(parcels::item);
            parcelStream.map(KTJUtils::parseParcel)
                    .flatMap(Collection::stream)
                    .filter(Objects::nonNull)
                    .forEach(p -> multiGeom.add(p));

            feat.setGeometry(multiGeom);
            return feat;
        } catch (XPathExpressionException xe) {
            throw new KsrApiException.InternalServerErrorException(
                    "Error parsing KTJ-response.",
                    xe
            );
        }
    }

    /**
     * Extracts all Polygon -geometries from Parcel Node.
     *
     * @param parcel The Parcel Node.
     * @return A List of Polygons.
     */
    private static List<Polygon> parseParcel(Node parcel) {
        try {
            return GMLUtils.parsePolygons(XMLUtils.getNode(parcel, PARCEL_LOCATION_EL));
        } catch (XPathExpressionException xe) {
            throw new KsrApiException.InternalServerErrorException(
                    "Error parsing GML-geometry.",
                    xe
            );
        }
    }
}
