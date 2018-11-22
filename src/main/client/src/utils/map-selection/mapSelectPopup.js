// @flow
import strings from '../../translations';
import { graphicsToEsriJSON } from '../arcFormats';

/**
 * Adds content and custom actions to views popup when map clicked.
 *
 * @param {Object} results Results from click event.
 * @param {Object} view Esri map view.
 * @param {Function} selectFeatures Redux function that selects features.
 * @param {Object[]} layerList List of layers.
 * @param {string} activeAdminTool Id of currently active admin layer.
 */
export const mapSelectPopup = (
    results: Object,
    view: Object,
    selectFeatures: Function,
    layerList: Object[],
    activeAdminTool: string,
) => {
    const getPropertyInfo = {
        title: strings.esriMap.getPropertyInfo,
        id: 'get-property-info',
        className: 'fas fa-building',
    };
    const googleStreetView = {
        title: strings.esriMap.openGoogleStreetView,
        id: 'google-street-view',
        className: 'fas fa-street-view',
    };

    view.popup.actions = [getPropertyInfo, googleStreetView];

    if (results.length) {
        const newResults = activeAdminTool
            ? [...results.filter(r => r.graphic.layer.id === activeAdminTool)]
            : [...results];

        newResults.forEach((layer) => {
            const fieldInfos = [];
            if (layer.graphic.layer.featureType === 'shapefile') {
                const columns = layer.graphic.layer.fields.slice(0, 5);
                columns.forEach((c) => {
                    fieldInfos.push({
                        fieldName: c.name,
                        label: c.name,
                    });
                });
            } else {
                const queryColumns = layerList
                    .filter(ll => ll.id === layer.graphic.layer.id)
                    .map(ll => ll.queryColumns);

                if (queryColumns.length) {
                    queryColumns[0].forEach((r) => {
                        fieldInfos.push({
                            fieldName: r,
                            label: layer.graphic.layer.fields
                                .find(l => l.name === r).alias,
                        });
                    });
                }
            }

            const selectIntersectAction = {
                title: strings.esriMap.selectIntersectFeatures,
                id: 'select-intersect',
                className: 'esri-icon-maps',
            };

            const setBufferAction = {
                title: strings.esriMap.setBuffer,
                id: 'set-buffer',
                className: 'far fa-dot-circle',
            };

            const actions = [selectIntersectAction, setBufferAction];
            if (layerList.some(ll => ll.id === layer.graphic.layer.id &&
                ll.alfrescoLinkField)) {
                const alfrescoLink = {
                    title: strings.esriMap.alfrescoLink,
                    id: 'alfresco-link',
                    className: 'fas fa-archive',
                };
                actions.push(alfrescoLink);
            }
            if (layerList.some(ll => ll.id === layer.graphic.layer.id &&
                ll.caseManagementLinkField)) {
                const caseManagementLink = {
                    title: strings.esriMap.caseManagementLink,
                    id: 'case-management-link',
                    className: 'fas fa-book',
                };
                actions.push(caseManagementLink);
            }

            layer.graphic.layer.popupTemplate = {
                title: layer.graphic.layer.title,
                content: [{
                    type: 'fields',
                    fieldInfos,
                }],
                actions,
            };
        });
        const graphics = newResults.map(re => re.graphic);
        const features = graphicsToEsriJSON(graphics);
        view.popup.viewModel.features = graphics;
        selectFeatures(features);
    } else {
        view.popup.title = strings.esriMap.noFeatures;
    }
};
