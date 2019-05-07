package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.controller.ProxyController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A Helper class to format Strings.
 */
@Component
public class KsrStringUtils {

    private static String CONTEXTPATH;

    /**
     * Sets context path.
     *
     * @param contextPath context path.
     */
    @Value("${server.servlet.context-path}")
    public void setContextPath(String contextPath) {
        CONTEXTPATH = contextPath;
    }

    /**
     * Returns a new String without trailing slash, or null if given string was null.
     *
     * @param str String to format.
     * @return String without trailing slash
     */
    public static String removeTrailingSlash(String str) {
        if (str == null) {
            return null;
        }
        return (str.endsWith("/") ? str.substring(0, str.length() - 1) : str);
    }

    /**
     * Returns a new String with trailing slash, or null if given string was null.
     *
     * @param str String to format.
     * @return String with trailing slash
     */
    public static String addTrailingSlash(String str) {
        if (str == null) {
            return null;
        }
        return str + (str.endsWith("/") ? "" : "/");
    }

    /**
     * Returns a new string with unnecessary slashes removed
     *
     * @param str String to format
     * @return String with unnecessary slashes removed
     */
    public static String replaceMultipleSlashes(String str) {
        if (str == null) {
            return null;
        }
        return str.replaceAll("(?<!(http:|https:))[//]+", "/");
    }

    /**
     * Returns a new string that replaces search layers id to layers original id
     *
     * @param str String to format.
     * @return String with search extension removed
     */
    static String replaceSearchId(String str) {
        if (str == null) {
            return null;
        }

        if (str.contains(".s")) {
            return str.replace(".s", "");
        } else {
            return str;
        }
    }

    /**
     * Format layer url to use proxy url.
     *
     * @param type Layer type.
     * @param id   Layer id.
     * @return Formatted layer url.
     */
    public static String formatLayerUrl(String type, String id) {
        String formatUrl;
        if ("agfs".equals(type)) {
            formatUrl = String.format("%s/%s/", CONTEXTPATH, ProxyController.PROXY_URL);
        } else {
            formatUrl = String.format("%s/%s/%s/", CONTEXTPATH, ProxyController.PROXY_URL, id);
        }
        return KsrStringUtils.replaceMultipleSlashes(formatUrl);
    }

    /**
     * Convert value into String.
     * 
     * If value is not type of null, List or Integer, then the value
     * will be returned surrounded by single-quotes.
     *
     * @param value Any Object.
     * @return Value converted to String.
     */
    @SuppressWarnings("unchecked")
    public static String toString(Object value) {
        if (value == null) {
            return null;
        } else if (value instanceof List) {
            return ((List<Object>) value)
                    .stream()
                    .map(KsrStringUtils::toString)
                    .collect(Collectors.joining(","));
        } else if (value instanceof Integer) {
            return value.toString();
        }
        return String.format("'%s'", value.toString());
    }
}
