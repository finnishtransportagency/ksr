package fi.sitowise.ksr.service;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = AESService.class)
@TestPropertySource(properties = {"aes.key=123456789ABCDFGH", "aes.iv=HGFDCBA987654321"})
public class AESServiceTests {

    @Autowired
    private AESService aesService;

    @Test
    public void testDecrypt() {
        Assert.assertEquals("testi", aesService.decrypt("/YjCt8GKe+A8cnUN+BiRnQ=="));
        Assert.assertEquals("k4y:kiu87", aesService.decrypt("WgkKs6C+wA3IsS0Oy7lu/A=="));
        Assert.assertEquals(
                "Test with longer text. And with numbers also (1234).",
                aesService.decrypt("fkczXanwhzcZitTwEg5ShKiRFv4NjEaPM8/AC/bDp/yswvN52PRhtcf7Y/cCMVLqJn3f5tOXg3F5GJcUguarBQ=="));
        Assert.assertNull(aesService.decrypt(null));
        Assert.assertNull(aesService.decrypt("CznjGyZF7XQ6pZNO8RvUOA=="));
    }

    @Test
    public void testEncrypt() {
        Assert.assertEquals("/YjCt8GKe+A8cnUN+BiRnQ==", aesService.encrypt("testi"));
        Assert.assertEquals("WgkKs6C+wA3IsS0Oy7lu/A==", aesService.encrypt("k4y:kiu87"));
        Assert.assertEquals(
                "fkczXanwhzcZitTwEg5ShKiRFv4NjEaPM8/AC/bDp/yswvN52PRhtcf7Y/cCMVLqJn3f5tOXg3F5GJcUguarBQ==",
                aesService.encrypt("Test with longer text. And with numbers also (1234)."));
        Assert.assertNull(aesService.encrypt(null));
    }
}
