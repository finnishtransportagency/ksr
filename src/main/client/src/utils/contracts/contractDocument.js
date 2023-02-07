// @flow
/**
 * Get document url built from document type and search value.
 * @param searchValue Search value, usually case number or other identifier.
 * @param documentType Type of the fetched document.
 * @returns {string} URL of the document.
 */
export const getDocumentUrl = (
    searchValue: string,
    documentType: string = 'caseManagement',
): string => (`${window.location.href}api/contract-document?documentType=${documentType}&searchValue=${searchValue}`);

/**
 * Gets contract document URL.
 *
 * @param {string} documentType Type of contract link (tiimeri | caseManagement).
 * @param {string} linkField Comma separated string with possible link fields.
 * @param {Object} attributes Feature attributes.
 *
 * @returns {?string} Contract document URL or null.
 */
export const getContractDocumentUrl = (
    documentType: string,
    linkField: string,
    attributes: Object,
): null | string => {
    const linkFields = linkField.split(',');
    const fieldExists = linkFields.some(field => attributes[field]);
    if (fieldExists) {
        const field = linkFields.find(f => attributes[f]);
        const searchValue = attributes[field];

        if (documentType === 'tiimeri' || documentType === 'caseManagement') {
            return getDocumentUrl(searchValue, documentType);
        }
    }
    return null;
};
