package fi.sitowise.ksr.utils.ktj;

import org.junit.Assert;
import org.junit.Test;

public class KtjNameSpaceResolverTests {

    @Test
    public void testGetNameSpaceURI() {
        KTJNameSpaceResolver resolver = new KTJNameSpaceResolver();

        Assert.assertEquals(
                "http://xml.nls.fi/ktjkiiwfs/2010/02",
                resolver.getNamespaceURI("ktjkiiwfs")
        );

        Assert.assertEquals(
                "http://www.opengis.net/gml",
                resolver.getNamespaceURI("gml")
        );
    }

    @Test(expected = IllegalArgumentException.class)
    public void testGetNameSpaceUnknownNS() {
        (new KTJNameSpaceResolver()).getNamespaceURI("test");
    }

    @Test
    public void testGetPrefix() {
        Assert.assertNull((new KTJNameSpaceResolver()).getPrefix("test"));
    }

    @Test
    public void testGetPrefixes() {
        Assert.assertNull((new KTJNameSpaceResolver()).getPrefixes("test"));
    }
}
