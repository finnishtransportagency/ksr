// @flow

/**
 * Gets url for alfresco- or caseManagement documents.
 *
 * @param {string} type Type of contract link (alfresco | caseManagement).
 * @param {string} linkField Comma separated string with possible link fields.
 * @param {Object} attributes Feature attributes.
 *
 * @returns {string | null} Alfresco-, caseManagement url or null.
 */
export const getContractDocumentUrl = (type: string, linkField: string, attributes: Object) => {
    const linkFields = linkField.split(',');
    const fieldExists = linkFields.some(field => attributes[field]);
    if (fieldExists) {
        const field = linkFields.find(f => attributes[f]);
        const value = attributes[field];
        switch (type) {
            case 'alfresco':
                return `https://extranet.liikennevirasto.fi/share/page/dp/ws/faceted-search#searchTerm=${value}`;
            case 'caseManagement':
                return `https://asianhallinta.liikennevirasto.fi/group/asianhallinta/haku#/?q=${value}`;
            default:
                return null;
        }
    }
    return null;
};
