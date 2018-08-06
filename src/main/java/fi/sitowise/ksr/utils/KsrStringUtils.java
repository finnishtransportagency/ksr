package fi.sitowise.ksr.utils;

/**
 * A Helper class to format Strings.
 */
public class KsrStringUtils {

    /**
     * Returns a new String without trailing slash, or null if given string was null.
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
     * @param str String to format
     * @return String with unnecessary slashes removed
     */
    public static String replaceMultipleSlashes(String str) {
        if (str == null) {
            return null;
        }
        return str.replaceAll("(?<!(http:|https:))[//]+", "/");
    }
}
