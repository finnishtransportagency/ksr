package fi.sitowise.ksr.utils.ktj;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.InputStream;

/**
 * A collection of commonly needed methods to work with w3c XML Documents and Nodes.
 */
public class XMLUtils {

    /**
     * Creates and returns an XPath Tool.
     *
     * XPath tool is initialized with KTJ WFS-namespace.
     *
     * @return XPath Tool.
     */
    private static XPath getXpath() {
        final XPath xpath = XPathFactory.newInstance().newXPath();
        xpath.setNamespaceContext(new KTJNameSpaceResolver());
        return xpath;
    }

    /**
     * Gets Node content as double.
     *
     * @param parentNode Node to search.
     * @param xPathExpr XPath expression to get target node.
     * @return Target nodes content as a double if content is not null, otherwise null.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    public static Double getNodeContentAsDouble(Node parentNode, String xPathExpr) throws XPathExpressionException {
        String stringValue = getNodeContent(parentNode, xPathExpr);
        return stringValue != null && !stringValue.isEmpty() ? Double.parseDouble(stringValue) : null;
    }

    /**
     * Gets Content of a matching Node as a String.
     *
     * @param parentNode Node to search.
     * @param xPathExpr XPath expression to get target node.
     * @return Nodes content as a String if node is not null, otherwise null.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    public static String getNodeContent(Node parentNode, String xPathExpr) throws XPathExpressionException {
        Node node = getNode(parentNode, xPathExpr);
        return node != null ? node.getTextContent() : null;
    }

    /**
     * Gets a Node found with given XPath expression.
     *
     * @param node Node to search.
     * @param xPathExpr XPath expression to get target node.
     * @return The found node.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    public static Node getNode(Node node, String xPathExpr) throws XPathExpressionException {
        final XPath xpath = getXpath();
        return (Node) xpath.evaluate( xPathExpr, node, XPathConstants.NODE);
    }

    /**
     * Returns a NodeList of all Nodes matching to XPath expression.
     *
     * @param source Node to search.
     * @param xPathExpr XPath expression to get target nodes.
     * @return NodeList of matching Nodes.
     * @throws XPathExpressionException XPathExpressionException if error in xpath.
     */
    public static NodeList getNodes(Object source, String xPathExpr) throws XPathExpressionException {
        final XPath xpath = getXpath();
        return (NodeList) xpath.evaluate(xPathExpr, source, XPathConstants.NODESET);
    }

    /**
     * Reads InputStream into a Document.
     *
     * @param is InputStream to read as a Document.
     * @return Document from InputStream.
     * @throws Exception A general exception.
     */
    public static Document parseDocument(InputStream is) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(is);
    }

}
