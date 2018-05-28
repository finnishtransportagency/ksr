package fi.sitowise.ksr.utils;

import org.junit.Assert;
import org.junit.Test;

public class KsrStringUtilsTests {

    @Test
    public void testWithoutTrailingSlash() {
        Assert.assertEquals("qwerty", KsrStringUtils.withoutTrailingSlash("qwerty/"));
        Assert.assertEquals(null, KsrStringUtils.withoutTrailingSlash(null));
        Assert.assertEquals("", KsrStringUtils.withoutTrailingSlash("/"));
        Assert.assertEquals("qwerty", KsrStringUtils.withoutTrailingSlash("qwerty"));
        Assert.assertEquals("", KsrStringUtils.withoutTrailingSlash(""));
    }
}
