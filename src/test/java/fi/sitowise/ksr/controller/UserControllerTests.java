package fi.sitowise.ksr.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {UserController.class})
@ComponentScan(
        basePackages = {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config"}
)
public class UserControllerTests {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private MockMvc mockMvc;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity()).build();
    }

    @Test
    public void testGetUserData() throws Exception {

        mockMvc.perform(get("/api/user")).andExpect(status().isForbidden());

        mockMvc.perform(get("/api/user")
                .header("OAM_REMOTE_USER", "TestUser")
                .header("OAM_USER_FIRST_NAME", "firstName")
                .header("OAM_USER_LAST_NAME", "lastName")
                .header("OAM_USER_MAIL", "test@test.com")
                .header("OAM_USER_MOBILE", "+123456789")
                .header("OAM_ORGANIZATION", "sitowise")
                .header("OAM_GROUPS", "KSR_ROLE_USER,KSR_ROLE_ADMIN")).andExpect(status().isOk());

    }
}
