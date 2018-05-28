package fi.sitowise.ksr.utils;

public class KsrStringUtils {

    public static String withoutTrailingSlash(String str) {
        if (str == null) {
            return null;
        }
        return (str.endsWith("/") ? str.substring(0, str.length() - 1) : str);
    }
}
