package fi.sitowise.ksr.domain.esri;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.assertj.core.util.Arrays;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@SpringBootTest
public class ResponseTests {

    @Test
    public void testGetAttributeValuesHasFeatures() {
        int[] array = {0, 1, 2, 3};
        List<Object> expected = Arrays.asList(array);

        Response res = new Response();
        res.setFeatures(createNFeatures(4));

        Assert.assertEquals(expected, res.getAttributeValues("test"));
    }

    @Test
    public void testGetAttributeValueHasZeroFeatures() {
        List<Object> expected = Collections.emptyList();
        Response res = new Response();
        res.setFeatures(Collections.emptyList());

        Assert.assertEquals(expected, res.getAttributeValues("empty"));
    }

    @Test
    public void testFetAttributeValueNullFeatures() {
        Assert.assertEquals(Collections.emptyList(), (new Response()).getAttributeValues("null"));
    }

    @Test
    public void testFromInputStream() {
        String json = "{\"objectIdFieldName\":\"\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPoint\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[{\"name\":\"NAME\",\"alias\":\"Name\",\"type\":\"esriFieldTypeString\",\"length\":70},{\"name\":\"STATUS\",\"alias\":\"Status\",\"type\":\"esriFieldTypeString\",\"length\":15},{\"name\":\"TYPE\",\"alias\":\"Type\",\"type\":\"esriFieldTypeSmallInteger\"}],\"features\":[{\"attributes\":{\"NAME\":\"Test feature\",\"STATUS\":\"OK\",\"TYPE\":20}}]}";
        InputStream is = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));

        Response expected = new Response();
        expected.setGlobalIdFieldName("");
        expected.setObjectIdFieldName("");

        Map<String, Object> nameMap = new HashMap<>();
        nameMap.put("name", "NAME");
        nameMap.put("alias", "Name");
        nameMap.put("type", "esriFieldTypeString");
        nameMap.put("length", 70);

        Map<String, Object> statusMap = new HashMap<>();
        statusMap.put("name", "STATUS");
        statusMap.put("alias", "Status");
        statusMap.put("type", "esriFieldTypeString");
        statusMap.put("length", 15);

        Map<String, Object> typeMap = new HashMap<>();
        typeMap.put("name", "TYPE");
        typeMap.put("alias", "Type");
        typeMap.put("type", "esriFieldTypeSmallInteger");

        List<Map<String, Object>> fields = new ArrayList<>();
        fields.add(nameMap);
        fields.add(statusMap);
        fields.add(typeMap);

        expected.setFields(fields);

        Feature feat = new Feature.Builder()
                .withParameter("NAME", "Test feature")
                .withParameter("STATUS", "OK")
                .withParameter("TYPE", 20)
                .build();

        expected.setFeatures(Collections.singletonList(feat));

        Response actual = Response.fromInputStream(is, "1");
        Assert.assertEquals(expected, actual);
    }

    @Test(expected = KsrApiException.InternalServerErrorException.class)
    public void testFromInputStreamInvalid() {
        InputStream is = new ByteArrayInputStream("a".getBytes(StandardCharsets.UTF_8));
        Response.fromInputStream(is, "123");
    }

    @Test
    public void testHasValueShouldHaveString() {
        String json = "{\"objectIdFieldName\":\"\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPoint\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[{\"name\":\"NAME\",\"alias\":\"Name\",\"type\":\"esriFieldTypeString\",\"length\":70},{\"name\":\"STATUS\",\"alias\":\"Status\",\"type\":\"esriFieldTypeString\",\"length\":15},{\"name\":\"TYPE\",\"alias\":\"Type\",\"type\":\"esriFieldTypeSmallInteger\"}],\"features\":[{\"attributes\":{\"NAME\":\"Test feature\",\"STATUS\":\"OK\",\"TYPE\":20}}]}";
        InputStream is = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        Response res = Response.fromInputStream(is, "2");
        Assert.assertTrue(res.hasValue("NAME", "Test feature"));
    }

    @Test
    public void testHasValueShouldHaveInteger() {
        String json = "{\"objectIdFieldName\":\"\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPoint\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[{\"name\":\"NAME\",\"alias\":\"Name\",\"type\":\"esriFieldTypeString\",\"length\":70},{\"name\":\"STATUS\",\"alias\":\"Status\",\"type\":\"esriFieldTypeString\",\"length\":15},{\"name\":\"TYPE\",\"alias\":\"Type\",\"type\":\"esriFieldTypeSmallInteger\"}],\"features\":[{\"attributes\":{\"NAME\":1,\"STATUS\":\"OK\",\"TYPE\":20}}]}";
        InputStream is = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        Response res = Response.fromInputStream(is, "2");
        Assert.assertTrue(res.hasValue("NAME", 1));
    }

    @Test
    public void testHasValueShouldHaveBoolean() {
        String json = "{\"objectIdFieldName\":\"\",\"globalIdFieldName\":\"\",\"geometryType\":\"esriGeometryPoint\",\"spatialReference\":{\"wkid\":102139,\"latestWkid\":3067},\"fields\":[{\"name\":\"NAME\",\"alias\":\"Name\",\"type\":\"esriFieldTypeString\",\"length\":70},{\"name\":\"STATUS\",\"alias\":\"Status\",\"type\":\"esriFieldTypeString\",\"length\":15},{\"name\":\"TYPE\",\"alias\":\"Type\",\"type\":\"esriFieldTypeSmallInteger\"}],\"features\":[{\"attributes\":{\"NAME\":true,\"STATUS\":\"OK\",\"TYPE\":20}}]}";
        InputStream is = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        Response res = Response.fromInputStream(is, "2");
        Assert.assertTrue(res.hasValue("NAME", true));
    }

    private List<Feature> createNFeatures(int n) {
        List<Feature> features = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            Feature feat = new Feature();
            feat.setAttributes(createMap("test", i));
            features.add(feat);
        }
        return features;
    }

    private Map<String, Object> createMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}
