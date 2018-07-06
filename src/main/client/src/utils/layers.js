/**
* Add or replace a layer in layerlist.
* If there is already a layer with same id, then replace that with new one.
*
* @param layerList Array of layers
* @param layer layer to add
*
* @returns layers Array of layers with new layer
*/
export const addOrReplaceLayer = (layerList, layer) => {
    const i = layerList.findIndex(l => l.id === layer.id);
    let layers = [...layerList];
    if (i !== -1) {
        layers[i] = layer;
    } else {
        layers = [layer, ...layerList];
    }
    return layers;
};

/**
* Adds or replaces layer in layergroup for search-layers.
* If layerGroup for search-features does not exists, then
* no action will be taken.
*
* @param layerGroups Array of layergroups
* @param layer layer to add
*
* @returns layerGroups Updated layerGroups
*/
export const addOrReplaceLayerInSearchGroup = (layerGroups, layer) => (
    layerGroups.map((lg) => {
        if (lg.type === 'search') {
            return { ...lg, layers: addOrReplaceLayer(lg.layers, layer) };
        }
        return { ...lg };
    })
);
