package fi.sitowise.ksr.utils;


import fi.sitowise.ksr.authentication.User;
import fi.sitowise.ksr.exceptions.KsrApiException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class KsrAuthenticationUtilsTests {

    private void setup(String username, String firstName, String lastName) {
        Authentication authentication = Mockito.mock(Authentication.class);
        User user = new User(username, firstName, lastName, null, null, null, null);
        Mockito.when(authentication.getPrincipal()).thenReturn(user);

        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @WithMockUser(username = "Teppo Testaaja")
    public void testGetCurrentUserName() {
        Assert.assertEquals("Teppo Testaaja", KsrAuthenticationUtils.getCurrentUsername());
    }

    @Test
    @WithMockUser(username = "Keijo Testaaja")
    public void testGetAuthentication() {
        Authentication authentication = KsrAuthenticationUtils.getAuthentication();
        Assert.assertEquals("Keijo Testaaja", authentication.getName());
    }

    @Test
    public void testGetCurrentUserUpdaterNameValid() {
        setup("K12345", "Seppo", "Testaaja");
        String updaterUsername = KsrAuthenticationUtils.getCurrentUserUpdaterName();

        Assert.assertEquals("S Testaaja", updaterUsername);
    }

    @Test
    public void testGetCurrentUserUpdaterNameLowercaseValid() {
        setup("K12345", "seppo", "testaaja");
        String updaterUsername = KsrAuthenticationUtils.getCurrentUserUpdaterName();

        Assert.assertEquals("S Testaaja", updaterUsername);
    }

    @Test
    public void testGetCurrentUserUpdaterNameMixedCaseValid() {
        setup("K12345", "sEppo", "tEsTAAJA");
        String updaterUsername = KsrAuthenticationUtils.getCurrentUserUpdaterName();

        Assert.assertEquals("S Testaaja", updaterUsername);
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    public void testGetCurrentUserUpdaterNameFirstNameIsNull() {
        setup("K12345", null, "Testaaja");
        KsrAuthenticationUtils.getCurrentUserUpdaterName();
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    public void testGetCurrentUserUpdaterNameFirstNameIsEmpty() {
        setup("K12345", "", "Testaaja");
        KsrAuthenticationUtils.getCurrentUserUpdaterName();
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    public void testGetCurrentUserUpdaterNameLastNameIsNull() {
        setup("K12345", "Seppo", null);
        KsrAuthenticationUtils.getCurrentUserUpdaterName();
    }

    @Test(expected = KsrApiException.ForbiddenException.class)
    public void testGetCurrentUserUpdaterNameLastNameIsEmpty() {
        setup("K12345", "Seppo", "");
        KsrAuthenticationUtils.getCurrentUserUpdaterName();
    }
}
