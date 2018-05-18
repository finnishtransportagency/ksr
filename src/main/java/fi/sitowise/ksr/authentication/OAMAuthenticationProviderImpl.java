package fi.sitowise.ksr.authentication;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;



/**
 * The Class OAMAuthenticationProviderImpl is a AuthenticationProvider for OAM-authentication, where 
 * authentication info comes in request headers.
 */
@Component
public class OAMAuthenticationProviderImpl implements OAMAuthenticationProvider {

    /**
     * Supports.
     *
     * @param authentication the authentication
     * @return true, if successful
     * @see org.springframework.security.authentication.AuthenticationProvider#supports(java.lang.Class)
     */
    @Override
    public boolean supports(Class<?> authentication) {
        return OAMAuthenticationToken.class.isAssignableFrom(authentication);
    }

    /**
     * Authenticate.
     *
     * @param authentication the authentication
     * @return the authentication
     * @see org.springframework.security.authentication.AuthenticationProvider#authenticate(org.springframework.security.core.Authentication)
     */
    @SuppressWarnings("unchecked")
    @Override
    public Authentication authenticate(Authentication authentication) {
        if (authentication.getName() != null && authentication.getCredentials() != null) {
            OAMAuthenticationToken oamAuthentication = (OAMAuthenticationToken) authentication;
            List<String> oamGroups = (List<String>) oamAuthentication.getCredentials();

            ArrayList<String> usergroups = new ArrayList<>();
            for (String entity : oamGroups) {
                usergroups.add(entity.trim());
            }

            if (usergroups.isEmpty()) {
                return null;
            }

            User user = oamAuthentication.getUser();
            user.setGroups(usergroups);
            oamAuthentication = new OAMAuthenticationToken(user, oamGroups, user.getAuthorities());
            oamAuthentication.setAuthenticated(true);
            return oamAuthentication;
        }

        return null;
    }
}
