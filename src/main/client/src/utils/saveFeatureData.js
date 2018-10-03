// @flow
/* eslint-disable no-use-before-define */
import { toast } from 'react-toastify';
import strings from '../translations';
import { addFeatures } from '../api/map/addFeatures';
import { updateFeatures } from '../api/map/updateFeatures';
import { createAddressFields } from './geoconvert/createAddressFields';

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
        Object.assign(newObject, { [`${a[i][0].split('/').pop()}`]: a[i][1] });
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
const handleSaveResponse = (res: Object, layer: Object) => {
    if (res && Array.isArray(res.addResults) && res.addResults.some(e => e.success)) {
        if (layer) {
            const ids = res.addResults.filter(e => e.success).map(e => e.objectId);
            layer.refresh();
            toast.success(`${strings.saveFeatureData.newFeatureSaveSuccess} [${ids.join(', ')}]`);
        } else {
            toast.error(strings.saveFeatureData.newFeatureSaveError);
        }
    } else {
        toast.error(strings.saveFeatureData.newFeatureSaveError);
    }
};

/**
* Handles response form Esri ArcGIS Servers FeatureService updateFeatures -request
* Returns an object, where features-attribute contains ids of those features that were updated.
*
* @param res Object Body of the response from ArcGIS Server
* @param layerId string Id of the corresponding layer.
*
* @return Object Object containing both layerId and feature-ids of updated features
*/
const handleUpdateResponse = (res: Object, layerId: string) => ({
    layerId,
    features: Array.isArray(res.updateResults) ?
        res.updateResults.filter(e => e.success).map(e => e.objectId) : [],
});


/**
* Display toast notification, if at least one feture saved for given layer.
*
* @param layer Object Returned layer from handleUpdateResponse-method
* @param originalLayer esri/layers/Layer
*
* @return layer Layer
*/
const notifyUpdateSuccess = (layer: Object, originalLayer: Object) => {
    if (layer && layer.features && layer.features.length) {
        toast.success(`
            ${strings.saveFeatureData.layerUpdateSaveSuccess} [${originalLayer.layer.title}]
        `);
    }
    return layer;
};

/**
 * This operation adds features to the associated feature layer
 *
 * @param action string Type of action (add | update)
 * @param view MapView Esri ArcGIS JS MapView
 * @param layerId string id of the corresponding layer
 * @param features Object[] Array of features
 */
const saveData = (
    action: string,
    view: Object,
    layerId: string,
    features: Object[],
) => {
    const params = featureDataToParams(features);
    const layer = findMatchingLayer(view, layerId);
    if (layer && params) {
        switch (action) {
            case 'add':
                return addFeatures(layerId, params).then(res =>
                    res && handleSaveResponse(res, layer))
                    .catch((err) => {
                        toast.error(`${strings.saveFeatureData.newFeatureSaveError}`);
                        console.error(err);
                    });
            case 'update':
                return updateFeatures(layerId, params).then(r =>
                    r && handleUpdateResponse(r, layerId))
                    .then(l => l && notifyUpdateSuccess(l, layer))
                    .catch((err) => {
                        toast.error(`
                            ${strings.saveFeatureData.layerUpdateSaveError} [${layer.layer.title}]
                        `);
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
* Removes underscore keys from given object.
*
* @param obj Object Object whose keys to filter
*
* @return Object New object without underscore keys
*/
const removeUnderscoreKeys = (obj: Object) => obj && Object.entries(obj)
    .filter(t => t[0][0] !== '_')
    .reduce((a, c) => ({ ...a, [c[0]]: c[1] }), {});

/**
* Format Object so that all attributes expect geometry are positioned under "attributes" -property
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
            const features = ed.data
                .filter(d => d._edited.length)
                .map(removeUnderscoreKeys)
                .map(formatToEsriCompliant);

            const layerId = ed.id;

            const promisesAddressField = features.map((feature) => {
                const geometryType = feature.geometry.type;
                return createAddressFields(feature, geometryType, featureType, addressField);
            });

            return Promise.all(promisesAddressField)
                .then(r => save.saveData('update', view, layerId, r));
        });
        return Promise.all(promises);
    }
    return Promise.reject(new Error('Error saving. Invalid input parameters.'));
};

const save = {
    saveEditedFeatureData,
    saveData,
    featureDataToParams,
    findMatchingLayer,
    handleSaveResponse,
    removeUnderscoreKeys,
    formatToEsriCompliant,
    notifyUpdateSuccess,
};

export default save;

/* eslint-enable no-use-before-define */
