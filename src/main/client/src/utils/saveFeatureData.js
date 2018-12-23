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
    } else if (view && view.allLayerViews) {
        return view.allLayerViews.find(lv => lv.layer && lv.layer.id === layerId);
    }
    return null;
};

/**
* Handles response from Esri ArcGIS Servers FeatureService addFeatures -request
* If saving any of features was succesfull, then refresh layer.
*
* @param res Object Body of the response from ArcGIS Server
* @param layer FeatureLayer esri/layers/FeatureLayer
*/
const handleSaveResponse = (res: Object, layer: ?Object) => {
    if (res && Array.isArray(res.addResults) && res.addResults.some(e => e.success)) {
        if (layer) {
            layer.refresh();
        }
        const ids = res.addResults.filter(e => e.success).map(e => e.objectId);
        toast.success(`${strings.saveFeatureData.newFeatureSaveSuccess} [${ids.join(', ')}]`);
    } else {
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
 * @param {Object} layerToRefresh Layer from view
 *
 * @returns {Object} Object containing layer id and feature ids of the updated features.
 */
const handleUpdateResponse = (res: Object, layerId: string, layerToRefresh: ?Object): Object => {
    if (layerToRefresh) {
        layerToRefresh.refresh();
    }
    const layer = {
        layerId,
        features: Array.isArray(res.updateResults) ?
            res.updateResults.filter(e => e.success).map(e => e.objectId) : [],
    };

    if (layer && layer.features && layer.features.length) {
        toast.success(`${strings.saveFeatureData.layerUpdateSaveSuccess}`);
    } else if (!layer.features.length) {
        toast.error(`${strings.saveFeatureData.layerUpdateSaveNoFeaturesError}`);
    } else {
        toast.error(`${strings.saveFeatureData.layerUpdateSaveError}`);
    }

    return layer;
};

/**
 * Handles response from Esri ArcGIS Servers FeatureService deleteFeatures -request.
 *
 * @param {Object} res Body of the response from ArcGIS Server.
 * @param {Object} layer Deleted features layer.
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
 * @param {Object} layer Updated layer data.
 * @param {Object} view MapView Esri ArcGIS JS MapView.
 * @param {string} layerId string id of the corresponding layer.
 * @param {string} objectId Id of feature.
 * @param {string} idFieldName Name of identifier field.
 */
const handlePopupUpdate = (
    layer: Object,
    view: Object,
    layerId: string,
    idFieldName?: string,
    objectId?: ?string,
) => {
    if (objectId && idFieldName) {
        queryFeatures(
            parseInt(layerId, 10),
            `${idFieldName} = ${objectId}`,
            null,
        ).then((queryResult) => {
            if (nestedVal(queryResult, ['fields']) &&
                nestedVal(queryResult, ['features']) &&
                queryResult.features.length > 0) {
                if (view.popup.viewModel.features[0]
                    .attributes[idFieldName] ===
                    queryResult.features[0].attributes[idFieldName]) {
                    // find current layer from view
                    const viewLayer = view.map.findLayerById(layerId);
                    if (viewLayer) {
                        // set new feature values to popup
                        view.popup.features[0].attributes =
                            queryResult.features[0].attributes;
                        // need to make a change to trigger update
                        const copyLayer = viewLayer.popupTemplate.content;
                        viewLayer.popupTemplate.content = '';
                        viewLayer.popupTemplate.content = copyLayer;
                    }
                }
            }
        });
    }
    return layer;
};

/**
 * This operation adds features to the associated feature layer.
 *
 * @param {string} action Type of action (add | update).
 * @param {Object} view MapView Esri ArcGIS JS MapView.
 * @param {string} layerId string id of the corresponding layer.
 * @param {Object[]} features Array of features.
 * @param {string} objectId Id of feature.
 * @param {string} idFieldName Name of identifier field.
 */
const saveData = (
    action: string,
    view: Object,
    layerId: string,
    features: Object[],
    objectId?: ?string,
    idFieldName?: string,
) => {
    const params = featureDataToParams(features);
    const layer = findMatchingLayer(view, layerId);
    if (params) {
        switch (action) {
            case 'add':
                return addFeatures(layerId, params.toString()).then(res =>
                    res && handleSaveResponse(res, layer))
                    .catch((err) => {
                        store.dispatch(handleFailedEdit('add', [layerId, params.toString()]));
                        toast.error(`${strings.saveFeatureData.newFeatureSaveError}`);
                        console.error(err);
                    });
            case 'update':
                return updateFeatures(layerId, params.toString()).then(res =>
                    res && handleUpdateResponse(res, layerId, layer))
                    .then(layerToUpdated => layerToUpdated &&
                        handlePopupUpdate(layerToUpdated, view, layerId, idFieldName, objectId))
                    .catch((err) => {
                        store.dispatch(handleFailedEdit('update', [layerId, params.toString()]));
                        toast.error(`${strings.saveFeatureData.layerUpdateSaveError}`);
                        console.error(err);
                    });
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
    (a, c) => (c[0] === 'geometry' ?
        { ...a, geometry: c[1] } :
        { ...a, attributes: { ...a.attributes, [c[0]]: c[1] } }),
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

            const layerId = ed.id;
            const idFieldNameWithoutLayerId = ed._idFieldName;
            let objectId = null;
            if (nestedVal(view, ['popup', 'viewModel', 'features']) && view.popup.viewModel.features.length > 0) {
                const currentData = ed.data.find(d => d._id ===
                    view.popup.viewModel.features[0].attributes[ed._idFieldName]);
                if (currentData) {
                    objectId = currentData._id;
                }
            }

            const promisesAddressField = features.map(feature => (
                createAddressFields(feature, featureType, addressField)
            ));

            return Promise.all(promisesAddressField)
                .then(r => save.saveData('update', view, layerId, r, objectId, idFieldNameWithoutLayerId));
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
