package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.domain.Layer;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import static fi.sitowise.ksr.utils.KsrStringUtils.formatLayerUrl;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = "server.servlet.context-path=/")
public class KsrStringUtilsTests {

    @Test
    public void testWithoutTrailingSlash() {
        Assert.assertEquals("qwerty", KsrStringUtils.removeTrailingSlash("qwerty/"));
        Assert.assertNull(KsrStringUtils.removeTrailingSlash(null));
        Assert.assertEquals("", KsrStringUtils.removeTrailingSlash("/"));
        Assert.assertEquals("qwerty", KsrStringUtils.removeTrailingSlash("qwerty"));
        Assert.assertEquals("", KsrStringUtils.removeTrailingSlash(""));
    }

    @Test
    public void testWithTrailingSlash() {
        Assert.assertEquals("aqwerty/", KsrStringUtils.addTrailingSlash("aqwerty/"));
        Assert.assertNull(KsrStringUtils.addTrailingSlash(null));
        Assert.assertEquals("/", KsrStringUtils.addTrailingSlash("/"));
        Assert.assertEquals("aqwerty/", KsrStringUtils.addTrailingSlash("aqwerty"));
        Assert.assertEquals("/", KsrStringUtils.addTrailingSlash(""));
    }

    @Test
    public void testWithMultipleSlahes() {
        Assert.assertEquals("http://localhost/ksr/api/layergroup", KsrStringUtils.replaceMultipleSlashes("http://localhost//ksr///api/layergroup"));
        Assert.assertEquals("https://localhost/ksr/api/layergroup", KsrStringUtils.replaceMultipleSlashes("https://localhost//ksr/api//layergroup"));
        Assert.assertNull(KsrStringUtils.replaceMultipleSlashes(null));
        Assert.assertEquals("/", KsrStringUtils.replaceMultipleSlashes("/"));
        Assert.assertEquals("/", KsrStringUtils.replaceMultipleSlashes("///"));
        Assert.assertEquals("", KsrStringUtils.replaceMultipleSlashes(""));
    }

    @Test
    public void testReplaceSearchId() {
        Assert.assertEquals("2", KsrStringUtils.replaceSearchId("2.s"));
        Assert.assertEquals("17", KsrStringUtils.replaceSearchId("17.s"));
        Assert.assertEquals("15", KsrStringUtils.replaceSearchId("15"));
        Assert.assertNull(KsrStringUtils.replaceSearchId(null));
    }

    @Test
    public void testFormatLayerUrl() {
        Layer l = new Layer();
        l.setUrl("http://111.11.222.122/arcgis/rest/services/dev/layer/FeatureServer/0");
        l.setType("agfs");
        l.setId("1234");
        Assert.assertEquals("/api/proxy/layer/", formatLayerUrl(l.getType(), l.getId()));
        l.setType("wms");
        Assert.assertEquals("/api/proxy/layer/1234/", formatLayerUrl(l.getType(), l.getId()));
    }
}
