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
