// @flow

/**
 * Open Alfresco web page if value is found.
 *
 * @param {Object} layerAlfrescoLink Property data columns.
 * @param {Object} attributes Layer attributes.
 * @returns {null} Open webpage or do nothing.
 */
export const getAlfrescoLink = (layerAlfrescoLink?: Object, attributes: Object) => {
    if (layerAlfrescoLink && layerAlfrescoLink.alfrescoLinkField) {
        const split = layerAlfrescoLink.alfrescoLinkField.split(',');
        split.some((s) => {
            const value = attributes[s];
            if (value) {
                const alfrescoLink = `https://extranet.liikennevirasto.fi/share/page/dp/ws/faceted-search#searchTerm=${value}`;
                return window.open(alfrescoLink, '_blank');
            }
            return null;
        });
    }
    return null;
};
