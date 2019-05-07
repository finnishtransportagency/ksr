package fi.sitowise.ksr.utils;

import fi.sitowise.ksr.authentication.User;
import fi.sitowise.ksr.exceptions.KsrApiException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 *  Helper class for authentication utils.
 */
public class KsrAuthenticationUtils {

    /**
     * Gets authentication.
     *
     * @return authentication
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * Gets current username.
     *
     * @return current username
     */
    public static String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    /**
     * Get current user's name combined from first letter of firstname + lastname.
     * E.g. Matti Meikalainen  -&gt; M Meikalainen.
     *
     * @return first letter of firstname + lastname.
     */
    public static String getCurrentUserUpdaterName() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getFirstName() == null || user.getFirstName().isEmpty()
                || user.getLastName() == null || user.getLastName().isEmpty()) {
            throw new KsrApiException.ForbiddenException(
                    String.format(
                            "No \"%s\" defined for user: %s",
                            user.getFirstName() == null || user.getFirstName().isEmpty() ? "firstName" : "lastName",
                            user.getUsername()
                    )
            );
        }
        return String.format(
                "%s %s",
                user.getFirstName().substring(0, 1).toUpperCase(),
                StringUtils.capitalize(user.getLastName().toLowerCase())
        );
    }

    /**
     * Get List of users usergroups.
     *
     * @return List of usergroups
     */
    public static List<String> getCurrentUserGroups() {
        Authentication auth = getAuthentication();
        if (auth != null) {
            Collection<? extends GrantedAuthority> authorities;
            if (auth.getPrincipal() instanceof User) {
                User user = (User) auth.getPrincipal();
                authorities = user.getAuthorities();
            } else {
                authorities = auth.getAuthorities();
            }
            if (authorities == null) {
                return null;
            }
            return authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        }
        return null;
    }
}
