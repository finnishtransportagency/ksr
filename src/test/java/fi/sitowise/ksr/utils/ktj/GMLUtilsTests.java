package fi.sitowise.ksr.utils.ktj;

import org.geojson.LngLatAlt;
import org.junit.Assert;
import org.junit.Test;
import org.geojson.Polygon;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class GMLUtilsTests {

    @Test
    public void testParsePolygonsSimple() throws Exception {
        String locationStr = "<ktjkiiwfs:sijainti xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" srsName=\"EPSG:3067\" xmlns:wfs=\"http://www.opengis.net/wfs\" timeStamp=\"2018-11-05T09:52:42Z\" xmlns:gml=\"http://www.opengis.net/gml\">" +
                "                        <gml:Surface>" +
                "                            <gml:patches>" +
                "                                <gml:PolygonPatch>" +
                "                                    <gml:exterior>" +
                "                                        <gml:LinearRing srsName=\"EPSG:3067\">" +
                "                                            <gml:posList>1 2 5 6 7 2 1 2</gml:posList>" +
                "                                        </gml:LinearRing>" +
                "                                    </gml:exterior>" +
                "                                </gml:PolygonPatch>" +
                "                            </gml:patches>" +
                "                        </gml:Surface>" +
                "                    </ktjkiiwfs:sijainti>";

        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(locationStr.getBytes(StandardCharsets.UTF_8)));
        Node location = XMLUtils.getNode(doc, "//ktjkiiwfs:sijainti");

        Polygon polygon = GMLUtils.parsePolygons(location).get(0);

        Polygon expectedPolygon = new Polygon();
        List<LngLatAlt> exterior = new ArrayList<>();
        exterior.add(new LngLatAlt(1, 2));
        exterior.add(new LngLatAlt(7, 2));
        exterior.add(new LngLatAlt(5, 6));
        exterior.add(new LngLatAlt(1, 2));
        expectedPolygon.setExteriorRing(exterior);

        Assert.assertEquals(expectedPolygon, polygon);
    }

    @Test
    public void testParsePolygonsInterior() throws Exception {
        String locationStr = "<ktjkiiwfs:sijainti xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" srsName=\"EPSG:3067\" xmlns:wfs=\"http://www.opengis.net/wfs\" timeStamp=\"2018-11-05T09:52:42Z\" xmlns:gml=\"http://www.opengis.net/gml\">" +
                "                        <gml:Surface>" +
                "                            <gml:patches>" +
                "                                <gml:PolygonPatch>" +
                "                                    <gml:exterior>" +
                "                                        <gml:LinearRing srsName=\"EPSG:3067\">" +
                "                                            <gml:posList>1 2 5 6 7 2 1 2</gml:posList>" +
                "                                        </gml:LinearRing>" +
                "                                    </gml:exterior>" +
                "                                    <gml:interior>" +
                "                                        <gml:LinearRing srsName=\"EPSG:3067\">" +
                "                                            <gml:posList>3 3 4 4 5 3 3 3</gml:posList>" +
                "                                        </gml:LinearRing>" +
                "                                    </gml:interior>" +
                "                                </gml:PolygonPatch>" +
                "                            </gml:patches>" +
                "                        </gml:Surface>" +
                "                    </ktjkiiwfs:sijainti>";

        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(locationStr.getBytes(StandardCharsets.UTF_8)));
        Node location = XMLUtils.getNode(doc, "//ktjkiiwfs:sijainti");

        Polygon polygon = GMLUtils.parsePolygons(location).get(0);

        Polygon expectedPolygon = new Polygon();

        List<LngLatAlt> exterior = new ArrayList<>();
        exterior.add(new LngLatAlt(1, 2));
        exterior.add(new LngLatAlt(7, 2));
        exterior.add(new LngLatAlt(5, 6));
        exterior.add(new LngLatAlt(1, 2));
        expectedPolygon.setExteriorRing(exterior);

        List<LngLatAlt> interior = new ArrayList<>();
        interior.add(new LngLatAlt(3, 3));
        interior.add(new LngLatAlt(4, 4));
        interior.add(new LngLatAlt(5, 3));
        interior.add(new LngLatAlt(3, 3));
        expectedPolygon.addInteriorRing(interior);

        Assert.assertEquals(expectedPolygon, polygon);
    }

}
