package fi.sitowise.ksr.utils.ktj;

import javax.xml.namespace.NamespaceContext;
import java.util.Iterator;

/**
 * NameSpaceResolver implementing NameSpaceContext.
 *
 * Can be used to help in parsing & reading KTJ WFS-response.
 */
public class KTJNameSpaceResolver implements NamespaceContext {

    public String getNamespaceURI(String prefix) {
        switch (prefix) {
            case "ktjkiiwfs":
                return "http://xml.nls.fi/ktjkiiwfs/2010/02";
            case "gml":
                return "http://www.opengis.net/gml";
            default:
                throw new IllegalArgumentException("Illegal argument \"prefix\".");
        }
    }

    public String getPrefix(String nameSpaceURI) {
        return null;
    }

    public Iterator getPrefixes(String namespaceURI) {
        return null;
    }
}
