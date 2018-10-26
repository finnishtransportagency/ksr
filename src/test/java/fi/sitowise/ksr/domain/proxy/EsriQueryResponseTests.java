package fi.sitowise.ksr.domain.proxy;

import org.junit.Assert;
import org.junit.Test;

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


    private Map<String, Map<String, Object>> createFeatureWithSingleAttribute(String name, Object value) {
        Map<String, Map<String, Object>> feature = new HashMap<>();
        Map<String, Object> attributes = new HashMap<>();
        attributes.put(name, value);
        feature.put("attributes", attributes);
        return feature;
    }

}
