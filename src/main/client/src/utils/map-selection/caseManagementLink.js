// @flow

/**
 * Opens Asianhallinta webpage if value is found.
 *
 * @param {Object} layerCaseManagementLink Property data columns.
 * @param {Object} attributes Layer attributes.
 * @returns {null} Open webpage or do nothing.
 */
export const getCaseManagementLink = (layerCaseManagementLink?: Object, attributes: Object) => {
    if (layerCaseManagementLink && layerCaseManagementLink.caseManagementLinkField) {
        const split = layerCaseManagementLink.caseManagementLinkField.split(',');
        split.some((s) => {
            const value = attributes[s];
            if (value) {
                const caseManagementLink = `https://asianhallinta.liikennevirasto.fi/group/asianhallinta/haku#/?q=${value}`;
                return window.open(caseManagementLink, '_blank');
            }
            return null;
        });
    }
    return null;
};
