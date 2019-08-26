package fi.sitowise.ksr.authentication;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Custom filter for reading OAM headers.
 */
@Component("oamFilter")
public class OAMFilter extends OncePerRequestFilter {

    @SuppressWarnings("unused")
    private static final Logger log = LogManager.getLogger(OAMFilter.class);

    @Value("${authorization.oam.authorized_groups_header}")
    private String oamGroupHeader;

    @Value("${authorization.oam.authorized_user_header}")
    private String oamUserHeader;

    @Value("${authorization.oam.authorized_user_first_name_header}")
    private String oamUserFirstNameHeader;

    @Value("${authorization.oam.authorized_user_last_name_header}")
    private String oamUserLastNameHeader;

    @Value("${authorization.oam.authorized_user_mail_header}")
    private String oamUserEmailHeader;

    @Value("${authorization.oam.authorized_user_mobile_header}")
    private String oamUserMobileHeader;

    @Value("${authorization.oam.authorized_user_organization_header}")
    private String oamUserOrganizationHeader;

    /**
     * @see org.springframework.web.filter.OncePerRequestFilter#doFilterInternal(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse, javax.servlet.FilterChain)
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String username = request.getHeader(this.oamUserHeader);
        String firstname = request.getHeader(this.oamUserFirstNameHeader);
        String lastname = request.getHeader(this.oamUserLastNameHeader);
        String email = request.getHeader(this.oamUserEmailHeader);
        String mobile = request.getHeader(this.oamUserMobileHeader);
        String organization = request.getHeader(this.oamUserOrganizationHeader);
        String groups = request.getHeader(this.oamGroupHeader);

        List<String> oamGroups = null;
        if (groups != null) {
            oamGroups = Arrays
                    .stream(groups.split(","))
                    .filter(Role::contains)
                    .collect(Collectors.toList());

            if (oamGroups.isEmpty()) {
                // No usergroups given in authentication headers, default to KSR_ROLE_USER.
                oamGroups.add(Role.ROLE_USER);
            }
        }
        
        if (username != null) {
        	User user = new User(username, firstname, lastname, email, mobile, organization, oamGroups);
        	OAMAuthenticationToken token = new OAMAuthenticationToken(user, oamGroups);
            SecurityContextHolder.getContext().setAuthentication(token);
        } else {
            List<String> headerNames = Collections.list(request.getHeaderNames());
            String headerNamesCSV = headerNames.stream().collect(Collectors.joining(","));
            log.info(String.format("Authentication error using headers: %s", headerNamesCSV));
        }

        filterChain.doFilter(request, response);
    }
}
