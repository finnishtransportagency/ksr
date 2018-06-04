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
}
