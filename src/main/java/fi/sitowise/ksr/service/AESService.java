package fi.sitowise.ksr.service;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * Service to encrypt and decrypt with AES256.
 */
@Service
public class AESService {

    private static Logger log = LogManager.getLogger(AESService.class);

    @Value("${aes.key}")
    private String key;

    @Value("${aes.iv}")
    private String initVector;

    /**
     * Encrypt given plain text string using AES-encryption.
     *
     * @param plain plain text to be encrypted
     * @return encrypted string
     */
    public String encrypt(String plain) {
        try {
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

            byte[] encrypted = cipher.doFinal(plain.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception ex) {
            log.error("Error while ecrypting: "+ExceptionUtils.getStackTrace(ex));
        }

        return null;
    }

    /**
     * Decrypt given String using AES.
     * If encrypted String is null, returns null.
     *
     * @param encrypted the encrypted string
     * @return the string in plain text
     */
    @Cacheable("aes_decrypt")
    public String decrypt(String encrypted) {
        if (encrypted == null) {
            return null;
        }
        try {
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

            byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));
            return new String(original);
        } catch (Exception ex) {
            log.error("Error while decrypting: "+ExceptionUtils.getStackTrace(ex));
        } finally {
            return null;
        }
    }
}
