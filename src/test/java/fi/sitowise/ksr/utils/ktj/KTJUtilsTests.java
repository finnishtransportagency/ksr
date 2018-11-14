package fi.sitowise.ksr.utils.ktj;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.geojson.*;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class KTJUtilsTests {

    @Ignore
    @Test
    public void testParseKTJResponse() {
        String response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<wfs:FeatureCollection xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\" timeStamp=\"1970-01-01T01:01:01Z\">" +
                "   <gml:featureMember>" +
                "      <ktjkiiwfs:RekisteriyksikonTietoja xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" gml:id=\"FI.KTJkii-RekisteriyksikonTietoja-00100200030004\">" +
                "         <ktjkiiwfs:kiinteistotunnus>00100200030004</ktjkiiwfs:kiinteistotunnus>" +
                "         <ktjkiiwfs:olotila>1</ktjkiiwfs:olotila>" +
                "         <ktjkiiwfs:rekisteriyksikkolaji>1</ktjkiiwfs:rekisteriyksikkolaji>" +
                "         <ktjkiiwfs:suhdePeruskiinteistoon>0</ktjkiiwfs:suhdePeruskiinteistoon>" +
                "         <ktjkiiwfs:rekisterointipvm>20170102</ktjkiiwfs:rekisterointipvm>" +
                "         <ktjkiiwfs:maapintaala>4.432</ktjkiiwfs:maapintaala>" +
                "         <ktjkiiwfs:nimi>Tonttila</ktjkiiwfs:nimi>" +
                "         <ktjkiiwfs:kuntaTieto>" +
                "            <!--Inlined feature 'null'-->" +
                "            <ktjkiiwfs:KuntaTieto>" +
                "               <ktjkiiwfs:kuntatunnus>091</ktjkiiwfs:kuntatunnus>" +
                "               <ktjkiiwfs:olotila>1</ktjkiiwfs:olotila>" +
                "               <ktjkiiwfs:nimiSuomeksi>Helsinki</ktjkiiwfs:nimiSuomeksi>" +
                "               <ktjkiiwfs:nimiRuotsiksi>Helsingfors</ktjkiiwfs:nimiRuotsiksi>" +
                "            </ktjkiiwfs:KuntaTieto>" +
                "         </ktjkiiwfs:kuntaTieto>" +
                "         <ktjkiiwfs:rekisteriyksikonPalstanTietoja>" +
                "            <!--Inlined feature 'FI.KTJkii-RekisteriyksikonPalstanTietoja-1234567899'-->" +
                "            <ktjkiiwfs:RekisteriyksikonPalstanTietoja gml:id=\"FI.KTJkii-RekisteriyksikonPalstanTietoja-1234567899\">" +
                "               <ktjkiiwfs:paivityspvm>20181105</ktjkiiwfs:paivityspvm>" +
                "               <ktjkiiwfs:tekstiKartalla>1-2-3-4</ktjkiiwfs:tekstiKartalla>" +
                "               <ktjkiiwfs:rekisteriyksikonKiinteistotunnus>00100200030004</ktjkiiwfs:rekisteriyksikonKiinteistotunnus>" +
                "               <ktjkiiwfs:sijainti>" +
                "                  <gml:Surface srsName=\"EPSG:3067\">" +
                "                     <gml:patches>" +
                "                        <gml:PolygonPatch>" +
                "                           <gml:exterior>" +
                "                              <gml:LinearRing srsName=\"EPSG:3067\">" +
                "                                 <gml:posList>1 2 5 6 7 2 1 2</gml:posList>" +
                "                              </gml:LinearRing>" +
                "                           </gml:exterior>" +
                "                        </gml:PolygonPatch>" +
                "                     </gml:patches>" +
                "                  </gml:Surface>" +
                "               </ktjkiiwfs:sijainti>" +
                "            </ktjkiiwfs:RekisteriyksikonPalstanTietoja>" +
                "         </ktjkiiwfs:rekisteriyksikonPalstanTietoja>" +
                "      </ktjkiiwfs:RekisteriyksikonTietoja>" +
                "   </gml:featureMember>" +
                "</wfs:FeatureCollection>";

        InputStream is = new ByteArrayInputStream(response.getBytes(StandardCharsets.UTF_8));

        Feature expectedFeature = new Feature();
        expectedFeature.setId("00100200030004");

        expectedFeature.setProperty("parcelCount", 1);
        expectedFeature.setProperty("registerUnitType", "1");
        expectedFeature.setProperty("name", "Tonttila");
        expectedFeature.setProperty("municipalityName", "Helsinki");

        expectedFeature.setProperty("landArea", 4.432);
        expectedFeature.setProperty("registrationDate", "20170102");
        expectedFeature.setProperty("propertyIdentifier", "00100200030004");

        Polygon expectedPolygon = new Polygon();
        List<LngLatAlt> exterior = new ArrayList<>();
        exterior.add(new LngLatAlt(1, 2));
        exterior.add(new LngLatAlt(7, 2));
        exterior.add(new LngLatAlt(5, 6));
        exterior.add(new LngLatAlt(1, 2));
        expectedPolygon.setExteriorRing(exterior);

        MultiPolygon expectedMultiPoly = new MultiPolygon();
        expectedMultiPoly.add(expectedPolygon);

        expectedFeature.setGeometry(expectedMultiPoly);

        FeatureCollection expectedFc = new FeatureCollection();
        expectedFc.add(expectedFeature);

        Assert.assertEquals(expectedFc, KTJUtils.parseKTJResponse(is));
    }

    @Test(expected = KsrApiException.InternalServerErrorException.class)
    public void testParseKTJResponseNullStream() {
        KTJUtils.parseKTJResponse(null);
    }

    @Test
    public void testParseKTJPdfLinks() {
        String response =
                "<karttaote>" +
                "    <rekisteriyksikko>12-345-67-89</rekisteriyksikko>" +
                "    <palstalkm>1</palstalkm>" +
                "    <oikeaksi_todistettava>false</oikeaksi_todistettava>" +
                "    <lang>FI</lang>" +
                "    <kopiointilupa/>" +
                "    <linkki>" +
                "        <url>www.testiurl1.fi</url>" +
                "        <alkusivu>1</alkusivu>" +
                "        <loppusivu>1</loppusivu>" +
                "    </linkki>" +
                "    <linkki>" +
                "        <url>www.testiurl2.fi</url>" +
                "        <alkusivu>1</alkusivu>" +
                "        <loppusivu>1</loppusivu>" +
                "    </linkki>" +
                "    <linkki>" +
                "        <url>www.testiurl3.fi</url>" +
                "        <alkusivu>1</alkusivu>" +
                "        <loppusivu>1</loppusivu>" +
                "    </linkki>" +
                "</karttaote>";

        InputStream inputStream = new ByteArrayInputStream(response.getBytes());
        List<String> pdfUrls = KTJUtils.parseKTJPdfLinks(inputStream);

        Assert.assertEquals("www.testiurl1.fi", pdfUrls.get(0));
        Assert.assertEquals("www.testiurl2.fi", pdfUrls.get(1));
        Assert.assertEquals("www.testiurl3.fi", pdfUrls.get(2));
    }
}
