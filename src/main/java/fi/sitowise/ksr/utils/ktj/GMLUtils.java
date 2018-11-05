package fi.sitowise.ksr.utils.ktj;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.geojson.LngLatAlt;
import org.geojson.Polygon;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPathExpressionException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;


/**
 * Simple utils for parsing GML-documents.
 * Compatible with Maanmittauslaitos KTJ WFS-Service.
 */
public class GMLUtils {
    private final static String GML_SURFACE_PATCHES_EL = "gml:Surface/gml:patches";
    private final static String GML_POLYGON_PATCH = "gml:PolygonPatch";
    private final static String GML_INTERIOR_EL = "gml:interior";
    private final static String GML_EXTERIOR_EL = "gml:exterior";
    private final static String GML_LINEAR_RING_POS_LIST_EL = "gml:LinearRing/gml:posList";

    /**
     * Parses a location-tag into a List of GeoJSON Polygons.
     *
     * @param location Node containing location.
     * @return List of GeoJSON Polygons.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    public static List<Polygon> parsePolygons(Node location) throws XPathExpressionException {
        NodeList patches = XMLUtils.getNodes(location, GML_SURFACE_PATCHES_EL);
        Stream<Node> patchesStream = IntStream.range(0, patches.getLength()).mapToObj(patches::item);
        return patchesStream.map(GMLUtils::parsePatch).flatMap(Collection::stream).collect(Collectors.toList());
    }

    /**
     * Parses a GML Patch into a List of GeoJSON Polygons.
     *
     * @param patch The patch Node.
     * @return A List of GeoJSON Polygons.
     */
    private static List<Polygon> parsePatch(Node patch) {
        try {
            NodeList polygons = XMLUtils.getNodes(patch, GML_POLYGON_PATCH);
            Stream<Node> polygonStream = IntStream.range(0, polygons.getLength()).mapToObj(polygons::item);
            return polygonStream.map(GMLUtils::parsePolygon).collect(Collectors.toList());
        } catch (XPathExpressionException xe) {
            throw new KsrApiException.InternalServerErrorException(
                "Error parsing GML-patch.",
                xe
            );
        }
    }

    /**
     * Parses a single GeoJSON Polygon from a GML Polygon element.
     *
     * @param polygon The polygon Node.
     * @return A GeoJSON Polygon.
     */
    private static Polygon parsePolygon(Node polygon) {
        try {
            Polygon geom = new Polygon();
            geom.setExteriorRing(getExteriorRing(polygon));
            getInteriorRings(polygon).forEach(ir -> geom.addInteriorRing(ir));
            return geom;
        } catch (XPathExpressionException xe) {
            throw new KsrApiException.InternalServerErrorException(
                "Error parsing GML-Polygon patch.",
                    xe
            );
        }
    }

    /**
     * Returns a List of interior rings.
     *
     * Interior ring is a coordinate array inside exterior ring, and can be used to define holes in a polygon.
     * Coordinates in interior rings must be clockwise according to GeoJSON-spec (ver. 2016).
     *
     * @param patch The patch Node.
     * @return List of Coordinate Arrays representing interior rings.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    private static List<List<LngLatAlt>> getInteriorRings(Node patch) throws XPathExpressionException {
        NodeList interiors = XMLUtils.getNodes(patch, GML_INTERIOR_EL);
        List<List<LngLatAlt>> rings = new ArrayList<>();
        for (int i = 0; i < interiors.getLength(); i++) {
            List<LngLatAlt> interior = getLinearRing(interiors.item(i));
            if (interior != null && !interior.isEmpty()) {
                rings.add(interior);
            }
        }
        return rings;
    }

    /**
     * Returns an exterior ring.
     *
     * Exterior rings defines the polygons boundaries.
     * Exterior ring must be counterclockwise according to GeoJSON-spec (ver. 2016).
     * Therefore the coordinates are reversed.
     *
     * @param patch The path Node.
     * @return Coordinate Array representing exterior ring.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    private static List<LngLatAlt> getExteriorRing(Node patch) throws XPathExpressionException {
        Node exterior = XMLUtils.getNode(patch, GML_EXTERIOR_EL);
        List<LngLatAlt> exteriorCoordinates = getLinearRing(exterior);
        Collections.reverse(exteriorCoordinates);
        return exteriorCoordinates;
    }

    /**
     * Returns an GeoJSON compliant coordinate Array from GML node.
     *
     * @param parent GML Node. Either gml:exterior or gml:interior.
     * @return A List of coordinates.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    private static List<LngLatAlt> getLinearRing(Node parent) throws XPathExpressionException {
        String posList = XMLUtils.getNodeContent(parent, GML_LINEAR_RING_POS_LIST_EL);
        return posListToGeoJSONCoordinates(posList);
    }

    /**
     * Converts an GMLs coordinate presentation ("x1 y1 x2 y2 x3 y3") into a List of Coordinates.
     *
     * @param posList A String in GMLs coordinate presentation format.
     * @return A List of coordinates.
     */
    private static List<LngLatAlt> posListToGeoJSONCoordinates(String posList) {
        List<LngLatAlt> coordinates = new ArrayList<>();
        if (posList == null) {
            return coordinates;
        }
        String[] pos = posList.split(" ");
        for (int i=0; i < pos.length - 1; i += 2) {
            double x = Double.parseDouble(pos[i]);
            double y = Double.parseDouble(pos[i + 1]);
            coordinates.add(new LngLatAlt(x, y));
        }
        return coordinates;
    }
}
