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
 * Parse different GeometryTypes
 * @param geometry Object geometry of object
 * @returns geometry
 */
export const parseGeometryType = (geometry: Object) => {
    let value = {};
    switch (geometry.type) {
        case 'point':
            value.x = geometry.x;
            value.y = geometry.y;
            break;
        case 'multipoint':
            value = geometry.points;
            break;
        case 'polyline':
            value = geometry.paths;
            break;
        case 'polygon':
            value = geometry.rings;
            break;
        default:
            return {};
    }
    return value;
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

/**
 * Parse data to Esri Field Types
 * @param value any data
 * @returns String Esri Field Types
 */
export const dataType = (value: any) => {
    // Returns if a value is a string
    if (value) {
        if (typeof value === 'string') {
            return 'esriFieldTypeString';
        }
    }
    // Returns if a value is really a number
    if (value) {
        if (typeof value === 'number') {
            return 'esriFieldTypeInteger';
        }
    }
    // Returns if value is a date object
    if (value) {
        if (value instanceof Date) {
            return 'esriFieldTypeDate';
        }
    }

    return 'esriFieldTypeString';
};
