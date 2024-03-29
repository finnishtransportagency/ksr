// @flow
import { nestedVal } from './nestedValue';
import { convert } from './geojson';

const zeroRegexp = /^([0-9]{14})$/;
const hyphenRegexp = /^([0-9]{1,3}-[0-9]{1,3}-[0-9]{1,4}-[0-9]{1,4})$/;
const hyphenIdentifierPattern = /\b0*([1-9][0-9]*|0)\b/;

/**
 * Validate property id format.
 *
 * @param {string} propertyId Property id.
 * @returns {boolean} Returns true or false if property id is in correct format.
 */
export const validatePropertyId = (propertyId: string): boolean => {
    if (typeof propertyId !== 'string') {
        return false;
    }
    return zeroRegexp.test(propertyId) || hyphenRegexp.test(propertyId);
};

/**
 * Check and convert property id for correct format.
 *
 * @param {string} propertyId Property id.
 * @returns {string} Returns formatted property id.
 */
export const propertyIdFormat = (propertyId: string): string => {
    if (typeof propertyId !== 'string') {
        return '';
    }

    if (hyphenRegexp.test(propertyId)) {
        return propertyId;
    }

    if (zeroRegexp.test(propertyId)) {
        return `${propertyId.substring(0, 3).replace(hyphenIdentifierPattern, '$1')}-${propertyId.substring(3, 6).replace(hyphenIdentifierPattern, '$1')}-${propertyId.substring(6, 10).replace(hyphenIdentifierPattern, '$1')}-${propertyId.substring(10, 14).replace(hyphenIdentifierPattern, '$1')}`;
    }

    return '';
};

/**
 * Convert property info to arcgis save format.
 *
 * @param {Object} propertyData property info data.
 * @param {number} ownerUnclearValue value of user-set OWNER_UNCLEAR-attribute
 * @param {string} notes value of user-set NOTES (muistiinpanot)
 * @returns {Promise<Object[]>} Promise that represents the list of formatted features.
 */
export const formatPropertyInfoToSaveFormat = (
    propertyData: Object,
    ownerUnclearValue: number,
    notes: string,
): Promise<$TupleMap<any, <T>(p: T | Promise<T>) => T>> | Promise<Array<empty>> => {
    if (Array.isArray(propertyData.features) && propertyData.features.length > 0) {
        return Promise.all(propertyData.features.map(async p => ({
            attributes: ({
                LAND_AREA: p.properties.landArea,
                MANAGEMENT_AREA: 0,
                MUNICIPALITY_NAME: p.properties.municipalityName,
                NAME: p.properties.name,
                PARCEL_COUNT: p.properties.parcelCount,
                PROPERTY_ID: p.properties.propertyIdentifier,
                REGISTER_UNIT_TYPE: p.properties.registerUnitTypeId,
                REGISTRATION_DATE: p.properties.registrationDate,
                OWNER_UNCLEAR: ownerUnclearValue,
                NOTES: notes,
            }),
            geometry: nestedVal(p, ['geometry', 'coordinates'])
                && await convert(p.geometry),
        })));
    }
    return Promise.resolve([]);
};
