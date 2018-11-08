package fi.sitowise.ksr.utils.ktj;

import org.junit.Assert;
import org.junit.Test;
import org.w3c.dom.Document;

import java.io.ByteArrayInputStream;

public class XMLUtilsTests {

    @Test
    public void testGetNodeContentAsDouble() throws Exception {
        String xml = "<a><b><c>12.123</c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertEquals(
                12.123,
                (Object) XMLUtils.getNodeContentAsDouble(doc, "a/b/c")
        );
    }

    @Test
    public void testGetNodeContentAsDoubleNoContent() throws Exception {
        String xml = "<a><b><c></c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertNull(XMLUtils.getNodeContentAsDouble(doc, "a/b/c"));
    }

    @Test
    public void testGetNodeContentAsDoubleNoNode() throws Exception {
        String xml = "<a><b></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertNull(XMLUtils.getNodeContent(doc, "a/b/c"));
    }

    @Test
    public void testGetNodeContent() throws Exception {
        String xml = "<a><b><c>Text content.</c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertEquals(
                "Text content.",
                XMLUtils.getNodeContent(doc, "a/b/c")
        );
    }

    @Test
    public void testGetNodeContentNoContent() throws Exception {
        String xml = "<a><b><c></c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertEquals("", XMLUtils.getNodeContent(doc, "a/b/c"));
    }

    @Test
    public void testGetNodeContentNoNode() throws Exception {
        String xml = "<a><b></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertNull(XMLUtils.getNodeContentAsDouble(doc, "a/b/c"));
    }

    @Test
    public void testGetNodes() throws Exception {
        String xml = "<a><b><c>1</c><c>2</c><c>3</c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertEquals(
                3,
                XMLUtils.getNodes(doc, "a/b/c").getLength()
        );
    }

    @Test
    public void testGetNodesNoNodes() throws Exception {
        String xml = "<a><b><c>1</c><c>2</c><c>3</c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertEquals(
                0,
                XMLUtils.getNodes(doc, "a/b/c/d").getLength()
        );
    }

    @Test
    public void testGetNode() throws Exception {
        String xml = "<a><b><c>1</c><c>2</c><c>3</c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertEquals(
                "1",
                XMLUtils.getNode(doc, "a/b/c").getTextContent()
        );
    }

    @Test
    public void testGetNodeNoNode() throws Exception {
        String xml = "<a><b><c>1</c><c>2</c><c>3</c></b></a>";
        Document doc = XMLUtils.parseDocument(new ByteArrayInputStream(xml.getBytes()));

        Assert.assertNull(XMLUtils.getNode(doc, "a/b/c/d"));
    }
}
