// @flow
import strings from '../../translations';
import { getFeatureInfo } from './featureInfo';
import { nestedVal } from '../nestedValue';
import { convertEsriGeometryType } from '../type';

/**
 * Adds content and custom actions to views popup when map clicked.
 *
 * @param {Object} results Results from click event.
 * @param {Object} view Esri map view.
 * @param {Object[]} layerList List of layers.
 * @param {string} activeAdminTool Id of currently active admin layer.
 * @param {string} geometryType Geometry type of currently active admin layer.
 * @param {number} x Screen x-coordinate (pixels).
 * @param {number} y Screen y-coordinate (pixels).
 *
 * @returns {Promise} Promise that resolves with selected features data or with generic
 * no features content if no features are found.
 */
export const mapSelectPopup = async (
    results: Object,
    view: Object,
    layerList: Object[],
    activeAdminTool: string,
    geometryType: string,
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
    const newResults = [...results, ...wmsFeatures];

    if (newResults.length) {
        newResults.forEach((feature) => {
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
            let textInfo = '';

            if (feature.layer) {
                if (feature.layer.featureType === 'shapefile') {
                    const columns = feature.layer.fields.slice(0, 5);
                    columns.forEach((c) => {
                        fieldInfos.push({
                            fieldName: c.name,
                            label: c.name,
                        });
                    });
                } else {
                    const matchingLayer = layerList
                        .find(ll => ll.id === feature.layer.id.replace('.s', ''));

                    if (matchingLayer
                        && matchingLayer.type === 'agfs'
                        && matchingLayer.queryColumnsList) {
                        const fields = nestedVal(feature, ['layer', 'fields']);
                        matchingLayer.queryColumnsList.forEach((column) => {
                            fieldInfos.push({
                                fieldName: column,
                                label: nestedVal(
                                    fields && fields.find(f => f.name === column),
                                    ['alias'],
                                ),
                            });
                        });

                        textInfo = matchingLayer.attribution;

                        const relationLayer = matchingLayer
                            && layerList.find(ll => (
                                ll.id === String(matchingLayer.relationLayerId)));

                        if (matchingLayer.hasRelations
                            && relationLayer
                            && relationLayer.layerPermission.readLayer) {
                            const contractLink = {
                                title: strings.modalFeatureContracts.featureContracts,
                                id: 'contract-link',
                                className: 'fas fa-external-link-square-alt',
                            };
                            actions.push(contractLink);
                        }
                    }
                }

                const activeAdminLayer = layerList.find(ll => ll.id === activeAdminTool);
                const addCopyAction = activeAdminTool
                    && activeAdminTool !== feature.layer.id
                    && geometryType
                    && convertEsriGeometryType(geometryType) === feature.layer.geometryType
                    && activeAdminLayer
                    && activeAdminLayer.layerPermission.createLayer;
                if (addCopyAction) {
                    const copyFeatureAction = {
                        title: strings.esriMap.copyFeature,
                        id: 'copy-feature',
                        className: 'far fa-clone',
                    };
                    actions.push(copyFeatureAction);
                }

                const addEditAction = activeAdminTool
                    && activeAdminTool === feature.layer.id
                    && activeAdminLayer
                    && activeAdminLayer.layerPermission.createLayer
                    && activeAdminLayer.layerPermission.updateLayer;
                if (addEditAction) {
                    const editFeatureAction = {
                        title: strings.esriMap.editFeature,
                        id: 'edit-feature',
                        className: 'fas fa-edit',
                    };
                    actions.push(editFeatureAction);
                }

                if (feature.layer.geometryType === 'polygon') {
                    const getAllPropertyInfo = {
                        title: strings.esriMap.getAllPropertyInfo,
                        id: 'get-all-property-info',
                        className: 'fas fa-city',
                    };
                    actions.push(getAllPropertyInfo);
                }

                feature.layer.popupTemplate = {
                    title: feature.layer.title,
                    content: [{
                        type: 'text',
                        text: textInfo,
                    },
                    {
                        type: 'fields',
                        fieldInfos,
                    }],
                    lastEditInfoEnabled: false,
                    actions,
                };
            }
        });

        return newResults;
    }

    return [{
        popupTemplate: {
            title: strings.esriMap.noFeatures,
            lastEditInfoEnabled: false,
        },
    }];
};
