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
 * Reorders child layers in layer list to be next to parent layers.
 *
 * @param {Object[]} layerList List to be reordered.
 *
 * @returns {Object[]} Reordered list.
 */
export const reorderChildLayers = (layerList: Object[]) => {
    let reorderedList = layerList;
    const childLayers = layerList.filter(layer => layer.parentLayer && layer._source !== 'search')
        .sort((a, b) => b.layerOrder - a.layerOrder);

    childLayers.forEach((childLayer) => {
        const childLayerIndex = reorderedList
            .findIndex(layer => layer.id === childLayer.id);
        let parentLayerIndex = reorderedList
            .findIndex(layer => layer.id === childLayer.parentLayer);
        parentLayerIndex = childLayerIndex > parentLayerIndex
            ? parentLayerIndex + 1
            : parentLayerIndex;

        reorderedList = reorder(reorderedList, childLayerIndex, parentLayerIndex);
    });

    return reorderedList;
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
    let originalLayerList: Object[] = [];
    layerGroups.forEach((layerGroup) => {
        layerGroup.layers.filter(layer => layerList
            .filter(ll => ll.active || ll.id === foundLayer.id)
            .find(ll => layer.id === ll.id))
            .forEach((layer) => { originalLayerList = [...originalLayerList, layer]; });
    });

    const originalLayer = originalLayerList
        .find(layer => layer.id === foundLayer.id.replace('.s', ''));
    const originalLayerOrder: number = originalLayer ? originalLayer.layerOrder : 0;

    const layersWithLowerOrder: Object[] = originalLayerList
        .filter(layer => !layer.definitionExpression && layer.layerOrder < originalLayerOrder);

    const startIndex = layerList.findIndex(layer => layer.id === foundLayer.id);
    const endIndex = layerList.filter(ll => ll.id !== foundLayer.id)
        .findIndex(ll => layersWithLowerOrder.find(layer => ll.id === layer.id));

    return endIndex >= 0
        ? reorder(layerList, startIndex, endIndex)
        : reorder(layerList, startIndex, layerList.length - 1);
};
