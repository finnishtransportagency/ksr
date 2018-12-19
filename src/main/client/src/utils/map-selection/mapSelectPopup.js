// @flow
import strings from '../../translations';
import { graphicsToEsriJSON } from '../arcFormats';
import { getFeatureInfo } from './featureInfo';
import { nestedVal } from '../nestedValue';

/**
 * Adds content and custom actions to views popup when map clicked.
 *
 * @param {Object} results Results from click event.
 * @param {Object} view Esri map view.
 * @param {Function} selectFeatures Redux function that selects features.
 * @param {Object[]} layerList List of layers.
 * @param {string} activeAdminTool Id of currently active admin layer.
 * @param {number} x Screen x-coordinate (pixels).
 * @param {number} y Screen y-coordinate (pixels).
 */
export const mapSelectPopup = async (
    results: Object,
    view: Object,
    selectFeatures: Function,
    layerList: Object[],
    activeAdminTool: string,
    x: number,
    y: number,
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

    const wmsFeatures = await getFeatureInfo(layerList, x, y, view.extent, view.height, view.width);
    const newResults = activeAdminTool
        ? [
            ...results.filter(r => r.graphic.layer && r.graphic.layer.id === activeAdminTool),
            ...wmsFeatures,
        ]
        : [...results, ...wmsFeatures];

    if (newResults.length) {
        newResults.forEach((layer) => {
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

            const fieldInfos = [];

            if (layer.graphic.layer && layer.graphic.layer.featureType === 'shapefile') {
                const columns = layer.graphic.layer.fields.slice(0, 5);
                columns.forEach((c) => {
                    fieldInfos.push({
                        fieldName: c.name,
                        label: c.name,
                    });
                });

                layer.graphic.layer.popupTemplate = {
                    title: layer.graphic.layer.title,
                    content: [{
                        type: 'fields',
                        fieldInfos,
                    }],
                    actions,
                };
            } else if (layer.graphic.layer) {
                const matchingLayer = layerList
                    .find(ll => ll.id === layer.graphic.layer.id.replace('.s', ''));

                if (matchingLayer && matchingLayer.type === 'agfs' && matchingLayer.queryColumnsList) {
                    const fields = nestedVal(layer, ['graphic', 'layer', 'fields']);
                    matchingLayer.queryColumnsList.forEach((column) => {
                        fieldInfos.push({
                            fieldName: column,
                            label: nestedVal(
                                fields && fields.find(f => f.name === column),
                                ['alias'],
                            ),
                        });
                    });

                    if (matchingLayer.hasRelations) {
                        const contractLink = {
                            title: strings.modalFeatureContracts.featureContracts,
                            id: 'contract-link',
                            className: 'fas fa-tasks',
                        };
                        actions.push(contractLink);
                    }

                    layer.graphic.layer.popupTemplate = {
                        title: layer.graphic.layer.title,
                        content: [{
                            type: 'fields',
                            fieldInfos,
                        }],
                        actions,
                    };
                }
            }
        });
        const graphics = newResults.map(re => re.graphic);
        const features = graphicsToEsriJSON(graphics
            .filter(graphic => graphic.layer && graphic.layer.geometryType !== undefined));
        view.popup.viewModel.features = graphics;
        selectFeatures(features);
    } else {
        view.popup.title = strings.esriMap.noFeatures;
    }
};
