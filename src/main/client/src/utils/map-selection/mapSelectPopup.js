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
                    // Use original layer's id instead of search layer id. Otherwise query columns
                    // are not populated in the popup for search layers.
                    .filter(ll => ll.id === layer.graphic.layer.id.replace('.s', ''))
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

            layer.graphic.layer.popupTemplate = {
                title: layer.graphic.layer.title,
                content: [{
                    type: 'fields',
                    fieldInfos,
                }],
                actions: [selectIntersectAction, setBufferAction],
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
