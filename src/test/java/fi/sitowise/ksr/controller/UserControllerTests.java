package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.helper.AuthControllerTestBase;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The type User controller tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {UserController.class})
@ComponentScan(
        basePackages = {"fi.sitowise.ksr.authentication", "fi.sitowise.ksr.config"}
)
public class UserControllerTests extends AuthControllerTestBase {

    /**
     * Sets .
     */
    @Before
    public void setup() { init(); }

    /**
     * Test get user data.
     *
     * @throws Exception the exception
     */
    @Test
    public void testGetUserData() throws Exception {

        this.mockMvc.perform(get("/api/user")).andExpect(status().isForbidden());

        this.mockMvc.perform(get("/api/user")
                .headers(this.getHeadersWithGroup("KSR_ROLE_USER,KSR_ROLE_ADMIN"))).andExpect(status().isOk());

    }
}
