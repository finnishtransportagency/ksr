package fi.sitowise.ksr.domain.proxy;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.junit.Assert;
import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class EsriQueryResponseTests {

    @Test
    public void testGetAttributeValuesFeaturesIsNull() {
        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setFeatures(null);

        Assert.assertEquals(0, eqr.getAttributeValues("test").size());
    }

    @Test
    public void testGetAttributeValuesNoFeatures() {
        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setFeatures(Collections.emptyList());

        Assert.assertEquals(0, eqr.getAttributeValues("test").size());
    }

    @Test
    public void testGetAttributeValuesNoMatchingAttributeValues() {
        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setFeatures(Arrays.asList(createFeatureWithSingleAttribute("oid", 123)));

        Assert.assertEquals(0, eqr.getAttributeValues("abc").size());
    }

    @Test
    public void testGetAttributeValuesOneMatchingIntegerAttributeValues() {
        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setFeatures(Arrays.asList(createFeatureWithSingleAttribute("oid", 123)));

        Object[] expected = { 123 };
        Object[] actual = eqr.getAttributeValues("oid").stream().toArray(Object[]::new);

        Assert.assertArrayEquals(expected, actual);
    }

    @Test
    public void testGetAttributeValuesThreeMatchingIntegerAttributeValues() {
        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setFeatures(
                Arrays.asList(
                        createFeatureWithSingleAttribute("oid", 123),
                        createFeatureWithSingleAttribute("oid", 231),
                        createFeatureWithSingleAttribute("abc", 333),
                        createFeatureWithSingleAttribute("oid", 321)
                )
        );

        Object[] expected = { 123, 231, 321 };
        Object[] actual = eqr.getAttributeValues("oid").stream().toArray(Object[]::new);

        Assert.assertArrayEquals(expected, actual);
    }

    @Test
    public void testGetAttributeValuesThreeMatchingStringAttributeValues() {
        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setFeatures(
                Arrays.asList(
                        createFeatureWithSingleAttribute("oid", "a1"),
                        createFeatureWithSingleAttribute("oid", "b2"),
                        createFeatureWithSingleAttribute("abc", "c3"),
                        createFeatureWithSingleAttribute("oid", "d4")
                )
        );

        Object[] expected = { "a1", "b2", "d4" };
        Object[] actual = eqr.getAttributeValues("oid").stream().toArray(Object[]::new);

        Assert.assertArrayEquals(expected, actual);
    }

    @Test
    public void testGetAttributeValuesThreeMatchingStringAndNullAttributeValues() {
        EsriQueryResponse eqr = new EsriQueryResponse();
        eqr.setFeatures(
                Arrays.asList(
                        createFeatureWithSingleAttribute("oid", "a1"),
                        createFeatureWithSingleAttribute("oid", null),
                        createFeatureWithSingleAttribute("abc", "c3"),
                        createFeatureWithSingleAttribute("oid", "u4")
                )
        );

        Object[] expected = { "a1", "u4" };
        Object[] actual = eqr.getAttributeValues("oid").stream().toArray(Object[]::new);

        Assert.assertArrayEquals(expected, actual);
    }

    @Test
    public void testFromInputStream() {
        InputStream is = new ByteArrayInputStream(("{" +
                "\"objectIdFieldName\":\"OBJECTID\"," +
                "\"globalIdFieldName\":\"\"," +
                "\"geometryType\":\"esriGeometryPolygon\"," +
                "\"spatialReference\":{" +
                "\"wkid\":102139," +
                "\"latestWkid\":3067}," +
                "\"fields\":[{" +
                "\"name\":\"C_ID\"," +
                "\"alias\":\"C_ID\"," +
                "\"type\":\"esriFieldTypeDouble\"}]," +
                "\"features\":[" +
                "{\"attributes\":{\"CO\":190, \"ID\":590}}," +
                "{\"attributes\":{\"CO\":390, \"ID\":990}}" +
                "]}").getBytes(StandardCharsets.UTF_8));

        EsriQueryResponse actual = EsriQueryResponse.fromInputStream(is, "1");

        EsriQueryResponse expected = new EsriQueryResponse();
        expected.setObjectIdFieldName("OBJECTID");
        expected.setGlobalIdFieldName("");

        List<Map<String, String>> fields = new ArrayList<>();
        Map<String, String> nameField = new HashMap<>();
        nameField.put("name", "C_ID");
        nameField.put("alias", "C_ID");
        nameField.put("type", "esriFieldTypeDouble");
        fields.add(nameField);

        List<Map<String, Map<String, Object>>> features = new ArrayList<>();

        Map<String, Map<String, Object>> feat1 = new HashMap<>();
        Map<String, Object> feat1Attrs = new HashMap<>();
        feat1Attrs.put("CO", 190);
        feat1Attrs.put("ID", 590);
        feat1.put("attributes", feat1Attrs);

        Map<String, Map<String, Object>> feat2 = new HashMap<>();
        Map<String, Object> feat2Attrs = new HashMap<>();
        feat2Attrs.put("CO", 390);
        feat2Attrs.put("ID", 990);
        feat2.put("attributes", feat2Attrs);

        features.add(feat1);
        features.add(feat2);

        expected.setFields(fields);
        expected.setFeatures(features);

        Assert.assertEquals(expected.equals(actual), true);
    }

    @Test(expected = KsrApiException.InternalServerErrorException.class)
    public void testFromNullInputStream() {
        EsriQueryResponse.fromInputStream(null, "1");
    }


    private Map<String, Map<String, Object>> createFeatureWithSingleAttribute(String name, Object value) {
        Map<String, Map<String, Object>> feature = new HashMap<>();
        Map<String, Object> attributes = new HashMap<>();
        attributes.put(name, value);
        feature.put("attributes", attributes);
        return feature;
    }

}
