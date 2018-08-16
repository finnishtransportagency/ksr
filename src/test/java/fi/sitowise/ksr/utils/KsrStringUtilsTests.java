package fi.sitowise.ksr.utils;

import org.junit.Assert;
import org.junit.Test;

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
}
