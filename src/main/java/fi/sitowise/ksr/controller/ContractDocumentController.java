package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.ContractDocumentService;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

/**
 * Controller for contract documents.
 */
@RestController
@RequestMapping("/api/contract-document")
public class ContractDocumentController {
    private final ContractDocumentService contractDocumentService;

    private static final Logger LOG = LogManager.getLogger(ContractDocumentController.class);

    @Autowired
    private ContractDocumentController(ContractDocumentService contractDocumentService) {
        this.contractDocumentService = contractDocumentService;
    }

    /**
     * Handles redirecting to alfresco or case management search URL.
     *
     * @param request HTTP Request. Contains document type and search value as query parameters.
     * @return Redirects to contract document URL.
     */
    @ApiOperation("Redirects to contract document URL")
    @GetMapping(value = "")
    public RedirectView redirectToContractDocumentUrl(HttpServletRequest request) {
        String documentType = request.getParameter("documentType");
        String searchValue = request.getParameter("searchValue");

        if (StringUtils.isEmpty(documentType) || StringUtils.isEmpty(searchValue)) {
            LOG.info(String.format("Cannot redirect to contract document URL, invalid query parameters given: [documentType=%s&searchValue=%s]", documentType, searchValue));
            throw new KsrApiException.BadRequestException("Invalid query parameters given.");
        }

        return new RedirectView(contractDocumentService.getContractDocumentUrl(documentType, searchValue));
    }
}
