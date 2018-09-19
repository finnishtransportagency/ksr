// @flow
import querystring from 'querystring';
import { fetchGetGeoconvert } from '../../api/geoconvert/getGeoconvert';
import { parseGeometryType } from '../type';

/**
 * Creates a list of string parameters that can be used for geoconvert fetch.
 *
 * Point will generate one set of parameters.
 * Multipoint will generate parameters for each created point.
 * Polyline will generate parameters for created lines start and end point.
 *
 * @param {Object} geometry Contains features geometry info.
 * @param {string} geometryType Type of esri geometry to be used in query.
 * @param {string} featureType Type of feature (road | water | railway).
 *
 * @returns {Array} List that contains geoconvert string parameters.
 */
export const createGeoconvertParams = (
    geometry: Object,
    geometryType: string,
    featureType: string,
) => {
    switch (geometryType) {
        case 'point':
            return (
                [
                    querystring.stringify({
                        y: geometry.y,
                        x: geometry.x,
                        featureType,
                    }),
                ]);
        case 'multipoint':
            return geometry.map(g => (querystring.stringify({
                y: g[1],
                x: g[0],
                featureType,
            })));
        case 'polyline':
            return (
                [
                    querystring.stringify({
                        y: geometry[0][0][1],
                        x: geometry[0][0][0],
                        featureType,
                    }), querystring.stringify({
                        y: geometry[0][geometry[0].length - 1][1],
                        x: geometry[0][geometry[0].length - 1][0],
                        featureType,
                    }),
                ]);
        default:
            return [];
    }
};

/**
 * Adds address attribute to features data.
 *
 * @param {Object} data Feature layer data without address.
 * @param {string} geometryType Type of esri geometry to be used in query.
 * @param {string} featureType Type of feature (road | water | railway).
 * @param {string} addressField Name of layers address field.
 *
 * @returns {Promise|Promise} Promise with feature data, including address field or
 * passed feature data if layer doesn't have feature type or address field.
 */
export const createAddressFields = (
    data: Object,
    geometryType: string,
    featureType: string,
    addressField: string,
) => new Promise((resolve) => {
    if (!featureType || !addressField) {
        resolve(data);
    }

    const geoconvertQueryParams = createGeoconvertParams(
        data.geometry.type ? parseGeometryType(data.geometry) : data.geometry,
        geometryType,
        featureType,
    );

    const geoconvertFetches = geoconvertQueryParams.map(params => fetchGetGeoconvert(params));

    Promise.all(geoconvertFetches).then((r) => {
        if (r.length) {
            const convertedAddress = r.map(address => (address.osoite ? address.osoite : null));
            data.attributes[addressField] = convertedAddress.join(', ');
        }

        resolve(data);
    });
});

