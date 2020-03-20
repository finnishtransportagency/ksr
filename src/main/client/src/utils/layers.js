// @flow

import strings from '../translations';

/**
 * Add or replace layers in layer list.
 * If there is already a layer with same id, then replace that with new one.
 *
 * @param {Object[]} layerList Array of layers.
 * @param {Object[]} layersToBeAdded Array of layers to be added.
 *
 * @returns {Object[]} layers Array of layers including the new layer.
 */
export const addOrReplaceLayers = (layerList: Object[], layersToBeAdded: Object[]) => {
    let layers = [...layerList];
    layersToBeAdded.forEach((layer) => {
        const i = layers.findIndex(l => l.id === layer.id);
        if (i !== -1) {
            layers[i] = layer;
        } else {
            layers = [layer, ...layers];
        }
    });
    return layers;
};

/**
 * Add or replace layers in layer group for search-layers.
 * If layer group for search-features does not exist no action will be taken.
 *
 * @param {Object[]} layerGroups Array of layer groups.
 * @param {Object[]} layers Array of layers to be added.
 *
 * @returns {Object[]} layerGroups Updated layer groups.
 */
export const addOrReplaceLayersInSearchGroup = (
    layerGroups: Object[],
    layers: Object[],
): Object[] => (
    layerGroups.map((lg) => {
        if (lg.type === 'search') {
            return { ...lg, layers: addOrReplaceLayers(lg.layers, layers) };
        }
        return { ...lg };
    })
);

/**
 * Add user layer or shapefile to layer group.
 *
 * @param {Object[]} layerGroups Array of layer groups.
 * @param {Object} layer Object with layer values.
 *
 * @returns {Object[]} layerGroups Updated layer groups.
 */
export const addLayerToUserGroup = (
    layerGroups: Object[],
    layer: Object,
): Object[] => layerGroups.map((lg) => {
    if (lg.name === strings.mapLayers.userLayerGroupName) {
        return {
            ...lg,
            layers: [...lg.layers, layer],
        };
    }
    return { ...lg };
});

/**
 * Returns boolean indicating if layer is viewable at given scale.
 *
 * @param {Object} layer Layer whose viewability to query.
 * @param {number} mapScale Map scale.
 * @returns {boolean} Is layer viewable at given scale.
 */
export const layerViewable = (layer: Object, mapScale: number) => (
    layer.maxScale < mapScale && (layer.minScale > mapScale || layer.minScale === 0)
);

/**
 * Check if layer is contract layer.
 * Checks only first relation by purpose.
 *
 * @param {Object} layer to determinate if it is contract layer.
 * @returns {boolean} Is layer contract layer.
 */
export const isContract = (layer: Object) => {
    if (layer && layer.name && layer.type && layer.relations) {
        const relation = layer.relations.find(r => r);
        if (relation && layer.type === 'agfl') {
            return (relation.relationColumnIn === null
                && relation.relationColumnOut === null)
                || relation.relationLayerId === null
                || layer.name.toLowerCase() === 'tlaite sopimushallinta';
        }
        return false;
    }
    return false;
};

/**
 * Get first contract layer which is not "tlaite sopimushallinta".
 *
 * @param {Object[]} contractLayers List of contractLayers.
 * @return {Object} contract layer.
 */
export const findFirstContractLayer = (contractLayers: Object[]) => (
    contractLayers.find(c => c.name && c.name.toLowerCase() !== 'tlaite sopimushallinta')
);
