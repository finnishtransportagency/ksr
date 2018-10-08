// @flow
/**
 * Parse Esri Field Type for input
 * @param type String esriFieldType
 * @returns String input type value
 */
export const parseColumnType = (type: String) => {
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
 * Find GeometryType from current layerId
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

/**
 *  Parse type to Esri Geometry Types
 * @param type String type
 * @returns String Esri Geometry Types
 */
export const convertEsriGeometryType = (type: string) => {
    let typeValue = null;
    switch (type.toLowerCase()) {
        case 'point':
            typeValue = 'esriGeometryPoint';
            break;
        case 'multipoint':
            typeValue = 'esriGeometryMultipoint';
            break;
        case 'polyline':
            typeValue = 'esriGeometryPolyline';
            break;
        case 'polygon':
            typeValue = 'esriGeometryPolygon';
            break;
        case 'envelope':
            typeValue = 'esriGeometryEnvelope';
            break;
        default:
            return 'esriGeometryPolygon';
    }
    return typeValue;
};
