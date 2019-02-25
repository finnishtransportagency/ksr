// @flow
/**
 * Parse EsriFieldType for input.
 *
 * @param {string} type EsriFieldType to be parsed.
 *
 * @returns {string} Parsed input type.
 */
export const parseColumnType = (type: string) => {
    let typeValue = null;
    switch (type) {
        case 'esriFieldTypeString':
            typeValue = 'text';
            break;
        case 'esriFieldTypeSmallInteger':
        case 'esriFieldTypeInteger':
        case 'esriFieldTypeSingle':
        case 'esriFieldTypeDouble':
            typeValue = 'number';
            break;
        case 'esriFieldTypeDate':
            typeValue = 'date';
            break;
        default:
            return 'text';
    }
    return typeValue;
};

/**
 * Find geometry type for given layer.
 *
 * @param {string} layerId Layer identifier.
 * @param {Object[]} layerList List of layers.
 *
 * @returns {string} Geometry type of wanted layer.
 */
export const findGeometryType = (
    layerId: string,
    layerList: Object[],
) => {
    const layer = layerList.find(l => l.id === layerId);
    if (layer) {
        return layer.geometryType;
    }
    return '';
};

/**
 * Convert Esri geometry type to normal geometry type.
 *
 * @param {string} type Esri geometry type to be converted.
 *
 * @returns {string} Normal geometry type.
 */
export const convertEsriGeometryType = (type: string) => {
    switch (type) {
        case 'esriGeometryPolygon':
            return 'polygon';
        case 'esriGeometryMultipoint':
            return 'multipoint';
        case 'esriGeometryPoint':
            return 'point';
        case 'esriGeometryPolyline':
            return 'polyline';
        case 'esriGeometryEnvelope':
            return 'rectangle';
        case 'esriGeometryCircularArc':
            return 'circle';
        default:
            return 'polygon';
    }
};
