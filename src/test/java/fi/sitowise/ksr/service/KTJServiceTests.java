package fi.sitowise.ksr.service;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.geojson.*;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
@WithMockUser(username = "test-user")
public class KTJServiceTests {

    @MockBean
    HttpRequestService httpRequestService;

    @Autowired
    KTJService ktjService;

    public void setUpCoordinates() {
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

        String body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<wfs:GetFeature xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1.0\" xsi:schemaLocation=\"http://www.opengis.net/wfs  http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">" +
                "<wfs:Query typeName=\"ktjkiiwfs:RekisteriyksikonTietoja\">" +
                "<ogc:Filter>" +
                "<ogc:Intersects>" +
                "<ogc:PropertyName>ktjkiiwfs:rekisteriyksikonPalstanTietoja/ktjkiiwfs:RekisteriyksikonPalstanTietoja/ktjkiiwfs:sijainti</ogc:PropertyName>" +
                "<gml:Point>" +
                "<gml:pos>123.400000 432.200000</gml:pos>" +
                "</gml:Point>" +
                "</ogc:Intersects>" +
                "</ogc:Filter>" +
                "</wfs:Query>" +
                "</wfs:GetFeature>";

        InputStream is = new ByteArrayInputStream(response.getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.postURLContents(
                Mockito.anyString(),
                Mockito.eq(body),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.eq(true)
        )).thenReturn(is);
    }

    public void setUp() {
        String response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<wfs:FeatureCollection xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\" timeStamp=\"1970-01-01T01:01:01Z\">" +
                "   <gml:featureMember>" +
                "      <ktjkiiwfs:RekisteriyksikonTietoja xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" gml:id=\"FI.KTJkii-RekisteriyksikonTietoja-00100200030004\">" +
                "         <ktjkiiwfs:kiinteistotunnus>00100200030005</ktjkiiwfs:kiinteistotunnus>" +
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

        String body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<wfs:GetFeature xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ktjkiiwfs=\"http://xml.nls.fi/ktjkiiwfs/2010/02\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1.0\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">" +
                "<wfs:Query typeName=\"ktjkiiwfs:RekisteriyksikonTietoja\" srsName=\"EPSG:3067\">" +
                "<ogc:Filter>" +
                "<ogc:PropertyIsEqualTo>" +
                "<ogc:PropertyName>ktjkiiwfs:kiinteistotunnus</ogc:PropertyName>" +
                "<ogc:Literal>00100200030005</ogc:Literal>" +
                "</ogc:PropertyIsEqualTo>" +
                "</ogc:Filter>" +
                "</wfs:Query>" +
                "</wfs:GetFeature>";

        InputStream is = new ByteArrayInputStream(response.getBytes(StandardCharsets.UTF_8));

        Mockito.when(httpRequestService.postURLContents(
                Mockito.anyString(),
                Mockito.eq(body),
                Mockito.anyString(),
                Mockito.anyString(),
                Mockito.eq(true)
        )).thenReturn(is);
    }

    @Test(expected = KsrApiException.BadRequestException.class)
    public void testGetPropertyDetailsNullPropertyIdentifier() {
        ktjService.getPropertyDetails(null);
    }

    @Test(expected = KsrApiException.BadRequestException.class)
    public void testGetPropertyDetailsInvalidPropertyIdentifier() {
        ktjService.getPropertyDetails("1-2-1-2-1");
    }

    @Test(expected = KsrApiException.BadRequestException.class)
    public void testGetPropertyDetailsXIsNull() {
        ktjService.getPropertyDetails(null, 12.3);
    }

    @Test(expected = KsrApiException.BadRequestException.class)
    public void testGetPropertyDetailsYIsNull() {
        ktjService.getPropertyDetails(34.2, null);
    }

    @Test(expected = KsrApiException.BadRequestException.class)
    public void testGetPropertyDetailsAreaIsNull() {
        ktjService.getPropertyDetailsArea( null);
    }

    @Test
    public void testGetPropertyDetailsCoordinates() {
        setUpCoordinates();

        FeatureCollection fc = ktjService.getPropertyDetails(123.4, 432.2);

        Feature expectedFeature = new Feature();
        expectedFeature.setId("00100200030004");

        expectedFeature.setProperty("parcelCount", 1);
        expectedFeature.setProperty("registerUnitType", "Tila");
        expectedFeature.setProperty("name", "Tonttila");
        expectedFeature.setProperty("municipalityName", "Helsinki");

        expectedFeature.setProperty("landArea", 4.432);
        expectedFeature.setProperty("registrationDate", "20170102");
        expectedFeature.setProperty("propertyIdentifier", "1-2-3-4");

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

        Assert.assertEquals(expectedFc, fc);
    }

    @Test
    public void testGetPropertyDetails() {
        setUp();

        FeatureCollection fc = ktjService.getPropertyDetails("00100200030005");

        Feature expectedFeature = new Feature();
        expectedFeature.setId("00100200030005");

        expectedFeature.setProperty("parcelCount", 1);
        expectedFeature.setProperty("registerUnitType", "Tila");
        expectedFeature.setProperty("name", "Tonttila");
        expectedFeature.setProperty("municipalityName", "Helsinki");

        expectedFeature.setProperty("landArea", 4.432);
        expectedFeature.setProperty("registrationDate", "20170102");
        expectedFeature.setProperty("propertyIdentifier", "1-2-3-5");

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

        Assert.assertEquals(expectedFc, fc);
    }
}
