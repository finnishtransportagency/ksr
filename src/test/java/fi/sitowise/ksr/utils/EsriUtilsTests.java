package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = "server.servlet.context-path=/")
public class EsriUtilsTests {

    @Test
    public void testCreateBasicQueryParamsNullOutFields() {
        List<NameValuePair> expectedParams = new ArrayList<>();
        expectedParams.add(new BasicNameValuePair("f", "pjson"));
        expectedParams.add(new BasicNameValuePair("returnGeometry", "false"));
        expectedParams.add(new BasicNameValuePair("outFields", "*"));

        Assert.assertEquals(expectedParams, EsriUtils.createBasicQueryParams(null));
    }

    @Test
    public void testCreateBasicQueryParams() {
        List<NameValuePair> expectedParams = new ArrayList<>();
        expectedParams.add(new BasicNameValuePair("f", "pjson"));
        expectedParams.add(new BasicNameValuePair("returnGeometry", "false"));
        expectedParams.add(new BasicNameValuePair("outFields", "ID"));

        Assert.assertEquals(expectedParams, EsriUtils.createBasicQueryParams("ID"));
    }

    @Test
    public void testCreateUrlA() {
        String expected = "http://test.ksr/query?f=pjson&id=2";

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "pjson"));
        params.add(new BasicNameValuePair("id", "2"));

        Assert.assertEquals(expected, EsriUtils.createUrl("http://test.ksr/", params));
    }

    @Test
    public void testCreateUrlB() {
        String expected = "http://test.ksr/asdf/query?f=pjson&id=2";

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("f", "pjson"));
        params.add(new BasicNameValuePair("id", "2"));

        Assert.assertEquals(expected, EsriUtils.createUrl("http://test.ksr/asdf/", params));
    }

    @Test
    public void testCreateUrlC() {
        String expected = "http://test.ksr/query";
        Assert.assertEquals(expected, EsriUtils.createUrl("http://test.ksr/", null));
    }

    @Test
    public void testGetLayerDefinitionValue() {
        InputStream is = new ByteArrayInputStream("{\"id\": 1, \"name\": \"test\"}".getBytes(StandardCharsets.UTF_8));
        Assert.assertEquals(Optional.of(1), EsriUtils.getLayerDefinitionValue(is, "id"));
    }

    @Test(expected = KsrApiException.InternalServerErrorException.class)
    public void testFetLayerDefinitionShouldRaiseException() {
        InputStream is = new ByteArrayInputStream("asdf".getBytes(StandardCharsets.UTF_8));
        EsriUtils.getLayerDefinitionValue(is, "test");
    }
}
