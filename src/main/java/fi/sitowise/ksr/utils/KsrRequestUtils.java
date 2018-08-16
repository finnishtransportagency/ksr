package fi.sitowise.ksr.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class KsrRequestUtils {

    /**
     * Get serviceEndpoint (the URL-path matching controllers RequestMapping wildcard).
     *
     * @param requestUri Request URI.
     * @return The serviceEndpoint.
     */
    public static String getServiceEndpoint(Pattern pattern, String requestUri) {
        if (requestUri == null) {
            return null;
        }
        Matcher matcher = pattern.matcher(requestUri);
        return matcher.find() ? matcher.group(1) : null;
    }
}
