// @flow

/**
 * Moves element in list from one index to another.
 *
 * @param {Object[]} list List to be reordered.
 * @param {number} startIndex Elements original index.
 * @param {number} endIndex Elements new index.
 *
 * @returns {Object[]} Reordered list.
 */
export const reorder = (list: Object[], startIndex: number, endIndex: number): Object[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Finds the original layer order for the activated layer and places it on top of the
 * first layer in current layer list that has lower original layer order.
 *
 * @param {Object[]} layerGroups Layer groups that contain original layer values.
 * @param {Object[]} layerList Modified layer list with changed values.
 * @param {Object} foundLayer Activated layer.
 *
 * @returns {Object[]} Reordered layer list.
 */
export const reorderLayers = (layerGroups: Object[], layerList: Object[], foundLayer: Object) => {
    let originalLayerList: any = [];
    layerGroups.forEach((layerGroup) => {
        layerGroup.layers.filter(layer => layerList
            .filter(ll => ll.active || ll.id === foundLayer.id)
            .find(ll => layer.id === ll.id))
            .forEach((layer) => { originalLayerList = [...originalLayerList, layer]; });
    });

    const originalLayerOrder: number = originalLayerList
        .find(layer => layer.id === foundLayer.id).layerOrder;

    const layersWithLowerOrder: Object[] = originalLayerList
        .filter(layer => layer.layerOrder < originalLayerOrder);

    const startIndex = layerList.findIndex(layer => layer.id === foundLayer.id);
    const endIndex = layerList.filter(ll => ll.id !== foundLayer.id)
        .findIndex(ll => layersWithLowerOrder.find(layer => ll.id === layer.id));

    return endIndex >= 0
        ? reorder(layerList, startIndex, endIndex)
        : reorder(layerList, startIndex, layerList.length - 1);
};
