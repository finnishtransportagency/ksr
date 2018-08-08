package fi.sitowise.ksr.authentication;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;



/**
 * The Class OAMAuthenticationProviderImpl is a AuthenticationProvider for OAM-authentication, where 
 * authentication info comes in request headers.
 */
@Component
public class OAMAuthenticationProviderImpl implements OAMAuthenticationProvider {
    private static final Logger log = LogManager.getLogger(OAMAuthenticationProviderImpl.class);

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
            User user = oamAuthentication.getUser();
            user.setGroups(usergroups);

            if (usergroups.isEmpty()) {
                log.info(String.format("Authentication error. No usergroups for user: <%s>.", user.getUsername()));
                return null;
            } else if (user.getAuthorities().size() > 1) {
                log.info(
                        String.format("Authentication error. Only one (1) usergroup allowed per user. User: <%s>.",
                                user.getUsername()
                        ));
                return null;
            } else if (user.getAuthorities().size() > 1) {
                log.info(
                        String.format("Authentication error. Only one (1) usergroup allowed per user. User: <%s>.",
                                user.getUsername()
                        ));
                return null;
            }

            oamAuthentication = new OAMAuthenticationToken(user, oamGroups, user.getAuthorities());
            oamAuthentication.setAuthenticated(true);
            return oamAuthentication;
        } else if (authentication.getName() == null && authentication.getCredentials() != null) {
            log.info("Authentication error. No username found.");
        } else if (authentication.getName() == null && authentication.getCredentials() == null) {
            log.info("Authentication error. Neither username or credentials found.");
        } else if (authentication.getName() != null && authentication.getCredentials() == null){
            log.info(
                String.format("Authentication error. No credentials found for user: <%s>.", authentication.getName())
            );
        }

        return null;
    }
}
