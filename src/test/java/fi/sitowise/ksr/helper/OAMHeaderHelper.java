package fi.sitowise.ksr.helper;

import fi.sitowise.ksr.authentication.Role;
import org.springframework.http.HttpHeaders;

public class OAMHeaderHelper {

    private static HttpHeaders getHeaders(String username, String mail, String organization, String groups) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("OAM_REMOTE_USER", username);
        headers.set("OAM_USER_MAIL", mail);
        headers.set("OAM_ORGANIZATION", organization);
        headers.set("OAM_GROUPS", groups);
        return headers;
    }

    public static HttpHeaders getAdminHeaders() {
        return getHeaders(
                "test-admin",
                "admin@example.com",
                "Administrators Oy",
                Role.ROLE_ADMIN);
    }

    public static HttpHeaders getUpdaterHeaders() {
        return getHeaders(
                "test-updater",
                "updater@example.com",
                "Updaters Oy",
                Role.ROLE_UPDATER);
    }

    public static HttpHeaders getExternalUpdaterHeaders() {
        return getHeaders(
                "test-external-updater",
                "external-updater@example.com",
                "External Updaters Oy",
                Role.ROLE_EXTERNAL_UPDATER);
    }

    public static HttpHeaders getNamedUserHeaders() {
        return getHeaders(
                "test-named-user",
                "named-user@example.com",
                "Named User Oy",
                Role.ROLE_NAMED_USER);
    }

    public static HttpHeaders getUserHeaders() {
        return getHeaders(
                "test-user",
                "user@example.com",
                "User Oy",
                Role.ROLE_USER);
    }

    public static HttpHeaders getAnonymousHeaders() {
        return getHeaders("test-user","user@example.com","User Oy", null);
    }
}
