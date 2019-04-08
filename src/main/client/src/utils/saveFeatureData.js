// @flow

/* eslint-disable no-use-before-define */
import { toast } from 'react-toastify';
import querystring from 'querystring';
import { deleteFeatures } from '../api/map/deleteFeatures';
import strings from '../translations';
import { addFeatures } from '../api/map/addFeatures';
import { updateFeatures } from '../api/map/updateFeatures';
import { createAddressFields } from './geoconvert/createAddressFields';
import { handleFailedEdit } from '../reducers/offline/actions';
import store from '../store';
import { nestedVal } from './nestedValue';
import { queryFeatures } from '../api/search/searchQuery';
import { addUpdateLayers } from '../reducers/table/actions';

/**
 * Convert attribute back to original Feature Layer attribute format.
 *
 * @param {Object} attributes Feature attributes.
 * @return {Object} Attributes without layerId on the attribute name.
 */
const parseAttributes = (attributes: Object) => {
    const a = Object.entries(attributes);
    const newObject = {};
    for (let i = 0; i < a.length; i += 1) {
        Object.assign(
            newObject,
            { [`${a[i][0].split('/').pop()}`]: a[i][1] === '' ? null : a[i][1] },
        );
    }
    return newObject;
};

/**
* Converts list of features into ArcGIS Server compliant formdata.
*
* @param features Object[] Array of features
* @return params URLSearchParams URLSearchParams generated
*/
const featureDataToParams = (features: Object[]) => {
    if (features === null || features === undefined) {
        return null;
    }

    const parsedFeatures = features.map(f => ({
        ...f,
        attributes: parseAttributes(f.attributes),
    }));

    const params = new URLSearchParams();
    params.append('f', 'json');
    params.append('features', JSON.stringify(parsedFeatures));
    return params;
};

/**
* Return mathing layer for give MapView if exists.
* Otherwise returns null
*
* @param view MapView Esri ArcGIS JS MapView
* @param layerId string id of the layer to find
*
* @return layer Layer Matching layer or null if not found
*/
const findMatchingLayer = (view: Object, layerId: string) => {
    if (layerId === null || layerId === undefined) {
        console.error(`Invalid layerId: ${layerId} supplied.`);
        return null;
    }
    if (view && view.allLayerViews) {
        return view.allLayerViews.find(lv => lv.layer && lv.layer.id === layerId);
    }
    return null;
};

/**
 * Handles response from Esri ArcGIS Servers FeatureService addFeatures -request.
 * If saving any of features was succesfull, then refresh layer.
 *
 * @param {Object} res Body of the response from ArcGIS Server.
 * @param {?Object} layer FeatureLayer esri/layers/FeatureLayer.
 * @param {boolean} [hideToast] Show saving data toast or not.
 */
const handleSaveResponse = (res: Object, layer: ?Object, hideToast?: boolean) => {
    if (res && Array.isArray(res.addResults) && res.addResults.some(e => e.success)) {
        if (layer) {
            layer.refresh();
        }
        const ids = res.addResults.filter(e => e.success).map(e => e.objectId);
        if (!hideToast) {
            toast.success(`${strings.saveFeatureData.newFeatureSaveSuccess} [${ids.join(', ')}]`);
        }
    } else if (!hideToast) {
        toast.error(strings.saveFeatureData.newFeatureSaveError);
    }
    return res;
};

/**
 * Handles response from Esri ArcGIS Servers FeatureService updateFeatures -request and displays
 * a notification toast according to the result.
 *
 * @param {Object} res Body of the response from ArcGIS Server.
 * @param {string} layerId Id of the corresponding layer.
 * @param {?Object} layerToRefresh Layer from view.
 * @param {boolean} [hideToast] Show saving data toast or not.
 *
 * @returns {Object} Object containing layer id and feature ids of the updated features.
 */
const handleUpdateResponse = (
    res: Object,
    layerId: string,
    layerToRefresh: ?Object,
    hideToast?: boolean,
): Object => {
    if (layerToRefresh) {
        layerToRefresh.refresh();
    }
    const layer = {
        layerId,
        features: Array.isArray(res.updateResults)
            ? res.updateResults.filter(e => e.success).map(e => e.objectId)
            : [],
    };

    if (layer && layer.features && layer.features.length && !hideToast) {
        toast.success(`${strings.saveFeatureData.layerUpdateSaveSuccess}`);
    } else if (!layer.features.length && !hideToast) {
        toast.error(`${strings.saveFeatureData.layerUpdateSaveNoFeaturesError}`);
    } else if (!hideToast) {
        toast.error(`${strings.saveFeatureData.layerUpdateSaveError}`);
    }

    return layer;
};

/**
 * Handles response from Esri ArcGIS Servers FeatureService deleteFeatures -request.
 *
 * @param {Object} res Body of the response from ArcGIS Server.
 * @param {?Object} layer Deleted features layer.
 */
const handleDeleteResponse = (res: Object, layer: ?Object) => {
    if (res && Array.isArray(res.deleteResults) && res.deleteResults.some(e => e.success)) {
        const deletedIds = res.deleteResults.filter(e => e.success).map(e => e.objectId);
        if (layer) layer.refresh();
        toast.success(`${strings.saveFeatureData.featureDeleteSuccess} [${deletedIds.join(', ')}]`);
    } else {
        toast.error(strings.saveFeatureData.featureDeleteNoFeaturesError);
    }
};
/**
 * Handle popup update if it is open.
 *
 * @param {Object} view MapView Esri ArcGIS JS MapView.
 * @param {string} layerId string id of the corresponding layer.
 * @param {string} idFieldName Name of identifier field.
 * @param {number[]} objectIds List of feature ids.
 */
const handlePopupUpdate = (
    view: Object,
    layerId: string,
    idFieldName: string,
    objectIds: number[],
) => {
    if (idFieldName && objectIds && objectIds.length) {
        queryFeatures(
            parseInt(layerId, 10),
            `${idFieldName} IN (${objectIds.join()})`,
            null,
        ).then((queryResult) => {
            const resultFeatureInPopup = nestedVal(view, ['popup', 'viewModel', 'features'], [])
                .some(feature => queryResult.features.some(resultFeature => (
                    resultFeature.attributes[idFieldName] === feature.attributes[idFieldName])));

            if (nestedVal(queryResult, ['fields'])
                && nestedVal(queryResult, ['features'])
                && queryResult.features.length > 0
                && idFieldName
                && resultFeatureInPopup
            ) {
                queryResult.features.forEach((resultFeature) => {
                    const featureIndex = view.popup.features.findIndex(feature => (
                        feature.attributes[idFieldName] === resultFeature.attributes[idFieldName]));
                    if (featureIndex >= 0) {
                        view.popup.features[featureIndex].attributes = resultFeature.attributes;
                    }
                });

                const viewLayer = view.map.findLayerById(layerId);
                if (viewLayer) {
                    // Need to make a change to trigger update.
                    const copyLayer = viewLayer.popupTemplate.content;
                    viewLayer.popupTemplate.content = copyLayer;
                }
            }
        });
    }
};

/**
 * This operation adds features to the associated feature layer.
 *
 * @param {string} action Type of action (add | update).
 * @param {Object} view MapView Esri ArcGIS JS MapView.
 * @param {string} layerId string id of the corresponding layer.
 * @param {Object[]} features Array of features.
 * @param {string} idFieldName Name of identifier field.
 * @param {number} [objectId] Id of feature.
 * @param {boolean} [hideToast] Show saving data toast or not.
 * @param {boolean} [selected] Is the feature selected on the table,
 */
const saveData = async (
    action: string,
    view: Object,
    layerId: string,
    features: Object[],
    idFieldName: string,
    objectId?: number,
    hideToast?: boolean,
    selected?: boolean,
) => {
    const params = featureDataToParams(features);
    const layer = findMatchingLayer(view, layerId);
    const { layers } = store.getState().table.features;
    const tableLayer = layers.find(l => l.id === layerId);
    if (params) {
        switch (action) {
            case 'add': {
                let res = null;
                try {
                    res = await addFeatures(layerId, params.toString());
                    await handleSaveResponse(res, layer, hideToast);
                    if (nestedVal(tableLayer, ['type']) === 'agfl'
                        && res && res.addResults && res.addResults.length > 0) {
                        store.dispatch(addUpdateLayers(
                            layerId,
                            idFieldName,
                            objectId || res.addResults[0].objectId,
                            selected,
                        ));
                    }
                } catch (err) {
                    store.dispatch(handleFailedEdit('add', [layerId, params.toString()]));
                    toast.error(`${strings.saveFeatureData.newFeatureSaveError}`);
                    console.error(err);
                }
                return res;
            }
            case 'update': {
                let layerToUpdated = null;
                try {
                    const featureInTable = tableLayer
                        && tableLayer.data.some(f => f._id === objectId);
                    const res = await updateFeatures(layerId, params.toString());
                    layerToUpdated = await handleUpdateResponse(res, layerId, layer, hideToast);
                    await handlePopupUpdate(view, layerId, idFieldName, layerToUpdated.features);
                    if (featureInTable && nestedVal(layerToUpdated, ['features', 'length']) && objectId) {
                        store.dispatch(addUpdateLayers(
                            layerId,
                            idFieldName,
                            objectId,
                            selected,
                        ));
                    }
                } catch (err) {
                    store.dispatch(handleFailedEdit('update', [layerId, params.toString()]));
                    toast.error(`${strings.saveFeatureData.layerUpdateSaveError}`);
                    console.error(err);
                }
                return layerToUpdated;
            }
            default:
                return Promise.reject(new Error(`No handler for action ${action}`));
        }
    } else {
        console.error(`Error in saving, no layer ${layerId} found.`);
        toast.error(strings.saveFeatureData.errorLayerNotFound);

        return Promise.reject(new Error(`Error in saving, no layer ${layerId} found.`));
    }
};

/**
 * Deletes given features from given layer.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {string} layerId Id of the corresponding layer.
 * @param {string} objectIds String of feature IDs to be deleted, separated by commas.
 * @param {string} [deleteComment] Reason for feature deletion.
 *
 * @returns {Promise} Promise that calls deleteFeature api.
 */
const saveDeletedFeatureData = (
    view: Object,
    layerId: string,
    objectIds: string,
    deleteComment: string,
) => {
    const layer = findMatchingLayer(view, layerId);
    const params = querystring.stringify({
        f: 'json',
        objectIds,
        deleteComment,
    });
    return deleteFeatures(layerId, params)
        .then(r => r && handleDeleteResponse(r, layer))
        .catch((err) => {
            console.error(err);
            store.dispatch(handleFailedEdit('delete', [layerId, params]));
            toast.error(strings.saveFeatureData.featureDeleteError);
        });
};

/**
* Format Object so that all attributes except geometry are positioned under "attributes" -property
*
* @param obj Object Object whose attributes to format
*
* @return Object New reshaped object
*/
const formatToEsriCompliant = (obj: Object) => obj && Object.entries(obj).reduce(
    (a, c) => (c[0] === 'geometry'
        ? { ...a, geometry: c[1] }
        : { ...a, attributes: { ...a.attributes, [c[0]]: c[1] } }),
    { attributes: {} },
);

/**
* Returns an object with only edited values, id-field (OBJECTID) and geometry field, if exists.
*
* @param {Object} obj Object to filter.
* @param {string} idFieldName Name of the id-field.
*
* @returns {Object} Object with only edited values and possible geometry field.
*/
const keepOnlyEdited = (obj: Object, idFieldName: ?string) => {
    const valueKeys = obj._edited.map(e => e.title);
    return Object.entries(obj).reduce((acc, cur) => {
        if (cur[0] === 'geometry' || valueKeys.indexOf(cur[0]) !== -1 || cur[0] === idFieldName) {
            return { ...acc, [cur[0]]: cur[1] };
        }
        return { ...acc };
    }, {});
};

/**
* Returns accessor for id-field, if any matching field can be found from columns-array.
* Otherwise returns undefined.
*
* @param {Object[]} columns Array of columns to look for.
* @param {string} idFieldName Name of the id-field.
*
* @returns {(string | undefined)} Field accessor or undefined if not found.
*/
const getIdFieldAccessor = (columns: Object[], idFieldName: string) => {
    const column = columns.find(c => c.Header === idFieldName);
    return column === undefined ? undefined : column.accessor;
};

/**
 * Saves edited data coming from table into ArcGIS Server.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {Object[]} editedData Array of customised Esri ArcGIS JS Layer-objects.
 * @param {string} featureType Type of feature (road | water | railway)
 * @param {string} addressField Name of layers address field.
 *
 * @returns {Promise} Promise of edited data.
 */
const saveEditedFeatureData = (
    view: Object,
    editedData: Object[],
    featureType: string,
    addressField: string,
) => {
    if (view && Array.isArray(editedData)) {
        const promises = editedData.map((ed) => {
            const idFieldName = getIdFieldAccessor(ed.columns, ed._idFieldName);
            const features = ed.data
                .filter(d => d._edited.length)
                .map(d => keepOnlyEdited(d, idFieldName))
                .map(formatToEsriCompliant);

            const layerId = ed.id.replace('.s', '');
            const idFieldNameWithoutLayerId = ed._idFieldName;
            let objectId = 0;
            if (nestedVal(view, ['popup', 'viewModel', 'features'])
                && view.popup.viewModel.features.length > 0) {
                const currentData = ed.data.find(d => (
                    d._id === view.popup.viewModel.features[0].attributes[ed._idFieldName]
                ));
                if (currentData) {
                    objectId = currentData._id;
                }
            }

            const promisesAddressField = features.map(feature => (
                createAddressFields(feature, featureType, addressField)
            ));

            return Promise.all(promisesAddressField)
                .then(r => save.saveData('update', view, layerId, r, idFieldNameWithoutLayerId, objectId));
        });
        return Promise.all(promises);
    }
    return Promise.reject(new Error('Error saving. Invalid input parameters.'));
};

const save = {
    saveEditedFeatureData,
    saveData,
    saveDeletedFeatureData,
    featureDataToParams,
    findMatchingLayer,
    handleSaveResponse,
    handleDeleteResponse,
    formatToEsriCompliant,
};

export default save;

/* eslint-enable no-use-before-define */
