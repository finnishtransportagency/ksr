// @flow
/**
 * Parse Esri column type for input
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
