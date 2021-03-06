package fi.sitowise.ksr.service;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Contract document service tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(value = SpringRunner.class)
@ContextConfiguration(classes = ContractDocumentService.class)
public class ContractDocumentServiceTests {
    @Autowired
    ContractDocumentService contractDocumentService;

    @Value("${contractdocument.tiimeri.search.url}")
    private String tiimeriUrl;

    @Value("${contractdocument.casemanagement.search.url}")
    private String caseManagementUrl;

    @Test(expected = KsrApiException.BadRequestException.class)
    public void testGetContractDocumentUrlThrowsException() {
        String expected = tiimeriUrl + "*123*";

        Assert.assertEquals(expected, contractDocumentService.getContractDocumentUrl("randomtype", "123"));
        Assert.assertEquals(expected, contractDocumentService.getContractDocumentUrl(null, null));
        Assert.assertEquals(expected, contractDocumentService.getContractDocumentUrl("", "123"));
        Assert.assertEquals(expected, contractDocumentService.getContractDocumentUrl("123", ""));
    }

    @Test
    public void testGetContractDocumentUrlTiimeri() {
        String documentType = "tiimeri";

        String expected1 = String.format("%s*%s*", tiimeriUrl, "123");
        Assert.assertEquals(expected1, contractDocumentService.getContractDocumentUrl(documentType, "123"));

        String expected2 = String.format("%s*%s*", tiimeriUrl, "987");
        Assert.assertEquals(expected2, contractDocumentService.getContractDocumentUrl(documentType, "987"));
    }

    @Test
    public void testGetContractDocumentUrlCaseManagement() {
        String documentType = "caseManagement";

        String expected1 = String.format("%s#/?q=%s", caseManagementUrl, "123");
        Assert.assertEquals(expected1, contractDocumentService.getContractDocumentUrl(documentType, "123"));

        String expected2 = String.format("%s#/?q=%s", caseManagementUrl, "987");
        Assert.assertEquals(expected2, contractDocumentService.getContractDocumentUrl(documentType, "987"));
    }
}
