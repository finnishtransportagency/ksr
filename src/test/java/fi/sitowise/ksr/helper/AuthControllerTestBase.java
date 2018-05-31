package fi.sitowise.ksr.helper;

import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

/**
 * The type Auth controller test base.
 */
@ComponentScan(
        basePackages = {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config"}
)
public class AuthControllerTestBase {

    /**
     * The Context.
     */
    @Autowired
    protected WebApplicationContext context;

    /**
     * The Mock mvc.
     */
    @Autowired
    protected MockMvc mockMvc;

    /**
     * Init.
     */
    protected void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    }

    /**
     * Gets headers with group.
     *
     * @param groupName the group name
     * @return the headers with group
     */
    protected HttpHeaders getHeadersWithGroup(String groupName) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("OAM_REMOTE_USER", "TestUser");
        headers.add("OAM_USER_FIRST_NAME", "firstName");
        headers.add("OAM_USER_LAST_NAME", "lastName");
        headers.add("OAM_USER_MAIL", "test@test.test");
        headers.add("OAM_USER_MOBILE", "+123456789");
        headers.add("OAM_ORGANIZATION", "Sitowise");
        headers.add("OAM_GROUPS", groupName);

        return headers;
    }
}
