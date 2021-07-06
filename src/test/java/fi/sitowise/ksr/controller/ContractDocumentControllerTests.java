package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.helper.AuthControllerTestBase;
import fi.sitowise.ksr.service.ContractDocumentService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Contract document controller tests.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {ContractDocumentController.class})
public class ContractDocumentControllerTests extends AuthControllerTestBase {

    @MockBean
    ContractDocumentService contractDocumentService;

    @Before
    public void setup() {
        init();
    }

    private String createTestUrl(InvocationOnMock invocation) {
        Object[] args = invocation.getArguments();
        String testUrl = "http://test.url.com";
        String testType = (String) args[0];
        String testValue = (String) args[1];

        return String.format("%s?documentType=%s&searchValue=%s", testUrl, testType, testValue);
    }

    @Test
    public void testRedirectToContractDocumentUrlTiimeriIsFoundAndRedirected() throws Exception {
        Mockito.when(contractDocumentService.getContractDocumentUrl(Mockito.eq("tiimeri"), Mockito.anyString()))
                .thenAnswer((Answer<String>) this::createTestUrl);

        this.mockMvc.perform(get("/api/contract-document")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .param("documentType", "tiimeri")
                .param("searchValue", "123"))
                .andExpect(status().isFound())
                .andExpect(MockMvcResultMatchers.redirectedUrl("http://test.url.com?documentType=tiimeri&searchValue=123"));

        this.mockMvc.perform(get("/api/contract-document")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .param("documentType", "tiimeri")
                .param("searchValue", "789"))
                .andExpect(status().isFound())
                .andExpect(MockMvcResultMatchers.redirectedUrl("http://test.url.com?documentType=tiimeri&searchValue=789"));
    }

    @Test
    public void testRedirectToContractDocumentUrlCaseManagementIsFoundAndRedirected() throws Exception {
        Mockito.when(contractDocumentService.getContractDocumentUrl(Mockito.eq("caseManagement"), Mockito.anyString()))
                .thenAnswer((Answer<String>) this::createTestUrl);

        this.mockMvc.perform(get("/api/contract-document")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .param("documentType", "caseManagement")
                .param("searchValue", "123"))
                .andExpect(status().isFound())
                .andExpect(MockMvcResultMatchers.redirectedUrl("http://test.url.com?documentType=caseManagement&searchValue=123"));

        this.mockMvc.perform(get("/api/contract-document")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .param("documentType", "caseManagement")
                .param("searchValue", "789"))
                .andExpect(status().isFound())
                .andExpect(MockMvcResultMatchers.redirectedUrl("http://test.url.com?documentType=caseManagement&searchValue=789"));
    }

    @Test(expected = KsrApiException.BadRequestException.class)
    public void testRedirectToContractDocumentUrlIsBadRequest() throws Exception {
        Mockito.when(contractDocumentService.getContractDocumentUrl(Mockito.anyString(), Mockito.anyString()))
                .thenThrow(KsrApiException.BadRequestException.class);

        Mockito.when(contractDocumentService.getContractDocumentUrl(Mockito.anyString(), Mockito.anyString()))
                .thenThrow(KsrApiException.BadRequestException.class);

        this.mockMvc.perform(get("/api/contract-document")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .param("documentType", "")
                .param("searchValue", ""));

        this.mockMvc.perform(get("/api/contract-document")
                .headers(this.getHeadersWithGroup("KSR_ROLE_ADMIN"))
                .param("documentType", "asd")
                .param("searchValue", "123"));
    }
}
