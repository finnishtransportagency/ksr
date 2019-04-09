package fi.sitowise.ksr.service;

import fi.sitowise.ksr.exceptions.KsrApiException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Contract document service.
 */
@Service
public class ContractDocumentService {

    @Value("${contractdocument.alfresco.search.url}")
    private String alfrescoUrl;

    @Value("${contractdocument.casemanagement.search.url}")
    private String caseManagementUrl;

    /**
     * Gets redirect URL for alfresco- or case management document search.
     *
     * @param documentType Type of document. Can be either alfresco or caseManagement.
     * @param searchValue Value used in contract document search.
     * @return URL to be redirected to.
     */
    public String getContractDocumentUrl(String documentType, String searchValue) {
        String redirectUrl;

        if (StringUtils.isEmpty(documentType) || StringUtils.isEmpty(searchValue)) {
            throw new KsrApiException.BadRequestException("Invalid query parameters given.");
        }

        switch (documentType) {
            case "alfresco":
                redirectUrl = String.format("%s#searchTerm=*%s*&scope=vuokravalvonta&sortField=null", alfrescoUrl, searchValue);
                break;
            case "caseManagement":
                redirectUrl = String.format("%s#/?q=%s", caseManagementUrl, searchValue);
                break;
            default:
                throw new KsrApiException.BadRequestException("Invalid query parameters given.");
        }

        return redirectUrl;
    }
}
