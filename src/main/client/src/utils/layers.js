/**
* Add or replace layers in layerlist.
* If there is already a layer with same id, then replace that with new one.
*
* @param layerList Array of layers
* @param layersToBeAdded Array of layers to be added
*
* @returns layers Array of layers with new layer
*/
export const addOrReplaceLayers = (layerList, layersToBeAdded) => {
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
* Add or replace layers in layergroup for search-layers.
* If layerGroup for search-features does not exists, then
* no action will be taken.
*
* @param layerGroups Array of layergroups
* @param layers Array of layers to be added
*
* @returns layerGroups Updated layerGroups
*/
export const addOrReplaceLayersInSearchGroup = (layerGroups, layers) => (
    layerGroups.map((lg) => {
        if (lg.type === 'search') {
            return { ...lg, layers: addOrReplaceLayers(lg.layers, layers) };
        }
        return { ...lg };
    })
);

/**
 * Add user layer or shapefile to layergroup
 *
 * @param layerGroups Array of layergroups
 * @param layer Object of layer values
 *
 * @returns layerGroups Updated layerGroups
 */
export const addLayerToUserGroup = (layerGroups, layer) => layerGroups.map((lg) => {
    if (lg.name === 'Käyttäjätasot') {
        return {
            ...lg,
            layers: [...lg.layers, layer],
        };
    }
    return { ...lg };
});
