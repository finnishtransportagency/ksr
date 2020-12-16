// @flow

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
) => {
    const linkFields = linkField.split(',');
    const fieldExists = linkFields.some(field => attributes[field]);
    if (fieldExists) {
        const field = linkFields.find(f => attributes[f]);
        const searchValue = attributes[field];

        if (documentType === 'tiimeri' || documentType === 'caseManagement') {
            return `${window.location.href}api/contract-document?documentType=${documentType}&searchValue=${searchValue}`;
        }
    }
    return null;
};
