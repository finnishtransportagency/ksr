// @flow
/**
 * Find GeometryType from current layerId
 *
 * @param layerId String of layer ID
 * @param layerList Array of layers
 * @returns GeometryType from current layerId
 */
export const findGeometryType = (
    layerId: string,
    layerList: Array<any>,
) => {
    const layer = layerList.find(l =>
        l.id === layerId);
    if (layer) {
        return layer.geometryType;
    }
    return '';
};
