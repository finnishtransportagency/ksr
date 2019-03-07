package fi.sitowise.ksr.authentication;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RoleTests {

    @Test
    public void testContainsDefinedRolesUppercase() {
        Assert.assertTrue(Role.contains("KSR_ROLE_ADMIN"));
        Assert.assertTrue(Role.contains("KSR_ROLE_UPDATER"));
        Assert.assertTrue(Role.contains("KSR_ROLE_EXTERNAL_UPDATER"));
        Assert.assertTrue(Role.contains("KSR_ROLE_NAMED_USER"));
        Assert.assertTrue(Role.contains("KSR_ROLE_USER"));
    }

    @Test
    public void testContainsDefinedRolesLowercase() {
        Assert.assertTrue(Role.contains("ksr_role_admin"));
        Assert.assertTrue(Role.contains("ksr_role_updater"));
        Assert.assertTrue(Role.contains("ksr_role_external_updater"));
        Assert.assertTrue(Role.contains("ksr_role_named_user"));
        Assert.assertTrue(Role.contains("ksr_role_user"));
    }

    @Test
    public void testNotContainsUndefinedRoles() {
        Assert.assertFalse(Role.contains(null));
        Assert.assertFalse(Role.contains("test"));
        Assert.assertFalse(Role.contains("KSR_ROLE_ADMIN1"));
        Assert.assertFalse(Role.contains("role_admin"));
    }
}
