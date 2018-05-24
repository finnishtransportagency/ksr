package fi.sitowise.ksr.authentication;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

/**
 * Custom authentication token for OAM.
 */
@SuppressWarnings("serial")
public class OAMAuthenticationToken extends PreAuthenticatedAuthenticationToken {

    public OAMAuthenticationToken(User user, Collection<String> oamGroups) {
        super(user, oamGroups);
    }

    public OAMAuthenticationToken(User user, Collection<String> oamGroups,
            Collection<? extends GrantedAuthority> authorities) {
        super(user, oamGroups, authorities);
    }

    public User getUser() {
        return (User) getPrincipal();
    }

    @SuppressWarnings("unchecked")
    public String getGroups() {
        Collection<String> groups = ((Collection<String>) getCredentials());
        return groups.toString();
    }
}
