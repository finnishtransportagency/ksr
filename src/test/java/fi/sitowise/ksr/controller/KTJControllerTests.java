package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.KTJService;
import org.geojson.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {KTJController.class})
public class KTJControllerTests extends AuthControllerTestBase {

    @MockBean
    KTJService ktjService;

    @Before
    public void setUp() {
        init();

        Feature feature1 = new Feature();
        feature1.setId("00100200030004");

        feature1.setProperty("parcelCount", 1);
        feature1.setProperty("registerUnitType", "1");
        feature1.setProperty("name", "Tonttila");
        feature1.setProperty("municipalityName", "Helsinki");

        feature1.setProperty("landArea", 4.432);
        feature1.setProperty("registrationDate", "20170102");
        feature1.setProperty("propertyIdentifier", "00100200030004");

        Polygon polygon1 = new Polygon();
        List<LngLatAlt> exterior1 = new ArrayList<>();
        exterior1.add(new LngLatAlt(1, 2));
        exterior1.add(new LngLatAlt(7, 2));
        exterior1.add(new LngLatAlt(5, 6));
        exterior1.add(new LngLatAlt(1, 2));
        polygon1.setExteriorRing(exterior1);

        MultiPolygon multiPoly1 = new MultiPolygon();
        multiPoly1.add(polygon1);

        feature1.setGeometry(multiPoly1);

        FeatureCollection fc1 = new FeatureCollection();
        fc1.add(feature1);

        Feature feature2 = new Feature();
        feature2.setId("00100200030005");

        feature2.setProperty("parcelCount", 1);
        feature2.setProperty("registerUnitType", "1");
        feature2.setProperty("name", "Lauttasaari");
        feature2.setProperty("municipalityName", "Helsinki");

        feature2.setProperty("landArea", 4.432);
        feature2.setProperty("registrationDate", "20170102");
        feature2.setProperty("propertyIdentifier", "00100200030005");

        Polygon polygon2 = new Polygon();
        List<LngLatAlt> exterior2 = new ArrayList<>();
        exterior2.add(new LngLatAlt(1, 2));
        exterior2.add(new LngLatAlt(8, 2));
        exterior2.add(new LngLatAlt(5, 6));
        exterior2.add(new LngLatAlt(1, 2));
        polygon2.setExteriorRing(exterior2);

        MultiPolygon multiPoly2 = new MultiPolygon();
        multiPoly2.add(polygon2);

        feature2.setGeometry(multiPoly2);

        FeatureCollection fc2 = new FeatureCollection();
        fc2.add(feature2);

        Mockito.when(ktjService.getPropertyDetails(Mockito.eq("1-2-3-4")))
                .thenReturn(fc1);

        Mockito.when(ktjService.getPropertyDetails(Mockito.eq("00100200030004")))
                .thenReturn(fc1);

        Mockito.when(ktjService.getPropertyDetails(Mockito.eq(123.432), Mockito.eq(456.43)))
                .thenReturn(fc2);

        Map<String, List<String>> pdfLinkMap = new HashMap<>();
        pdfLinkMap.put("registerunit", Collections.singletonList("registeruniturl"));
        pdfLinkMap.put("map", Collections.singletonList("mapurl"));
        pdfLinkMap.put("deed", Collections.singletonList("deedurl"));
        pdfLinkMap.put("easement", Collections.singletonList("easementurl"));

        Mockito.when(ktjService.getPropertyPdfLinks(Mockito.eq("123-45-67-89"), Mockito.eq("fi")))
                .thenReturn(pdfLinkMap);
    }

    @Test
    public void testGetPropertyDetailsHyphen() throws Exception {
        String expectedJSON = "{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"parcelCount\":1,\"registerUnitType\":\"1\",\"name\":\"Tonttila\",\"landArea\":4.432,\"registrationDate\":\"20170102\",\"municipalityName\":\"Helsinki\",\"propertyIdentifier\":\"00100200030004\"},\"geometry\":{\"type\":\"MultiPolygon\",\"coordinates\":[[[[1.0, 2.0],[7.0, 2.0],[5.0, 6.0],[1.0, 2.0]]]]},\"id\":\"00100200030004\"}]}";

        this.mockMvc.perform(
                get("/api/property/1-2-3-4").headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(status().isOk());

        this.mockMvc.perform(
                get("/api/property/1-2-3-4").headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(content().json(expectedJSON));
    }

    @Test
    public void testGetPropertyDetailsNumeric() throws Exception {
        String expectedJSON = "{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"parcelCount\":1,\"registerUnitType\":\"1\",\"name\":\"Tonttila\",\"landArea\":4.432,\"registrationDate\":\"20170102\",\"municipalityName\":\"Helsinki\",\"propertyIdentifier\":\"00100200030004\"},\"geometry\":{\"type\":\"MultiPolygon\",\"coordinates\":[[[[1.0, 2.0],[7.0, 2.0],[5.0, 6.0],[1.0, 2.0]]]]},\"id\":\"00100200030004\"}]}";

        this.mockMvc.perform(
                get("/api/property/00100200030004").headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(status().isOk());

        this.mockMvc.perform(
                get("/api/property/00100200030004").headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(content().json(expectedJSON));
    }

    @Test
    public void testGetPropertyDetailsCoordinates() throws Exception {
        String expectedJSON = "{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"parcelCount\":1,\"registerUnitType\":\"1\",\"name\":\"Lauttasaari\",\"landArea\":4.432,\"registrationDate\":\"20170102\",\"municipalityName\":\"Helsinki\",\"propertyIdentifier\":\"00100200030005\"},\"geometry\":{\"type\":\"MultiPolygon\",\"coordinates\":[[[[1.0, 2.0],[8.0, 2.0],[5.0, 6.0],[1.0, 2.0]]]]},\"id\":\"00100200030005\"}]}";

        this.mockMvc.perform(
                get("/api/property/?x=123.432&y=456.43").headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(status().isOk());

        this.mockMvc.perform(
                get("/api/property/?x=123.432&y=456.43").headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(content().json(expectedJSON));
    }

    @Test
    public void testGetPropertyNoCredentials() throws Exception {
        this.mockMvc.perform(get("/api/property/?x=123.432&y=456.43")).andExpect(status().isForbidden());
        this.mockMvc.perform(get("/api/property/1-2-3-4")).andExpect(status().isForbidden());
        this.mockMvc.perform(get("/api/property/00100200030004")).andExpect(status().isForbidden());
    }

    @Test
    public void testGetPropertyPdfLinks() throws Exception {
        // TODO: Disabled property PDF -query in KSR-448. 
        //  Can be added back back after API -agreement has been finished.
        this.mockMvc.perform(
                get("/api/property/pdf/links?propertyIdentifier=123-45-67-89&language=fi")
                        .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        ).andExpect(status().isForbidden());
        
        //String expectedJSON = "{\"registerunit\":[\"registeruniturl\"],\"map\":[\"mapurl\"],\"deed\":[\"deedurl\"],\"easement\":[\"easementurl\"]}";
        //this.mockMvc.perform(
        //        get("/api/property/pdf/links?propertyIdentifier=123-45-67-89&language=fi")
        //                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        //).andExpect(status().isOk());
        //
        //this.mockMvc.perform(
        //        get("/api/property/pdf/links?propertyIdentifier=123-45-67-89&language=fi")
        //                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
        //).andExpect(content().json(expectedJSON));
    }

    @Test
    public void testGetPropertyPdfLinksInsufficientUserRights() throws Exception {
        this.mockMvc.perform(
                get("/api/property/pdf/links?propertyIdentifier=123-45-67-89&language=fi")
                        .headers(this.getHeadersWithGroup("KSR_ROLE_USER"))
        ).andExpect(status().isForbidden());
    }
}
