// @flow

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
    if (lg.name === 'Käyttäjätasot') {
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
