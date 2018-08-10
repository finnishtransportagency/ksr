package fi.sitowise.ksr.utils;

import org.junit.Assert;
import org.junit.Test;

import java.util.regex.Pattern;

public class KsrRequestUtilsTests {

    /**
     * Test get service endpoint.
     */
    @Test
    public void testGetServiceEndpoint() {
        Pattern pattern = Pattern.compile("^\\/api\\/proxy\\/layer\\/\\d{1,6}\\/(.*?)$");
        Assert.assertNull(KsrRequestUtils.getServiceEndpoint(pattern, null));
        Assert.assertEquals(
                "1.00/GetCapalibites.xml",
                KsrRequestUtils.getServiceEndpoint(pattern, "/api/proxy/layer/134/1.00/GetCapalibites.xml"));
        Assert.assertEquals(
                "a/b/c/D?e=f&g=h",
                KsrRequestUtils.getServiceEndpoint(pattern,"/api/proxy/layer/321/a/b/c/D?e=f&g=h"));
        Assert.assertEquals("", KsrRequestUtils.getServiceEndpoint(pattern,"/api/proxy/layer/321/"));
        Assert.assertNull(KsrRequestUtils.getServiceEndpoint(pattern, "/api/proxy/layer/321"));
    }
}
