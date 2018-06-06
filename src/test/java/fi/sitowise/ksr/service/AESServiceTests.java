package fi.sitowise.ksr.service;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = AESService.class)
public class AESServiceTests {

    @Autowired
    private AESService aesService;

    @Test
    public void testDecrypt() {
        Assert.assertEquals("testi", aesService.decrypt("J8OqFpN9+8JDXwkuFeRmWw=="));
        Assert.assertEquals("k4y:kiu87", aesService.decrypt("c+dn8O/bb8d4RvLhZVtzew=="));
        Assert.assertEquals(
                "Test with longer text. And with numbers also (1234).",
                "MZR4vpE7RDtmTiMvCEhzr1mB1PohEEw9SBtCfV0fYcWqjqKDsecb4dadLvmM23hEbkWjGvW9wuTMkv0O96CAuw==");
        Assert.assertNull(aesService.decrypt(null));
    }

    @Test
    public void testEncrypt() {
        Assert.assertEquals("J8OqFpN9+8JDXwkuFeRmWw==", aesService.encrypt("testi"));
        Assert.assertEquals("c+dn8O/bb8d4RvLhZVtzew==", aesService.encrypt("k4y:kiu87"));
        Assert.assertEquals(
                "MZR4vpE7RDtmTiMvCEhzr1mB1PohEEw9SBtCfV0fYcWqjqKDsecb4dadLvmM23hEbkWjGvW9wuTMkv0O96CAuw==",
                aesService.encrypt("Test with longer text. And with numbers also (1234)."));
        Assert.assertNull(aesService.encrypt(null));
    }
}
