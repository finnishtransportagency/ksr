// @flow
import querystring from 'querystring';
import strings from '../../translations';
import { fetchGetGeoconvert } from '../../api/geoconvert/getGeoconvert';

/**
 * Creates a list of string parameters that can be used for geoconvert fetch.
 *
 * Point will generate one set of parameters.
 * Multipoint will generate parameters for each created point.
 * Polyline will generate parameters for created lines start and end point.
 *
 * @param {Object} geometry Contains features geometry info.
 * @param {string} geometryType Type of esri geometry to be used in query.
 * @param {string} featureType Type of feature (road | street | water | railway).
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
            return geometry.points.map(g => (querystring.stringify({
                y: g[1],
                x: g[0],
                featureType,
            })));
        case 'polyline':
            return (
                [
                    querystring.stringify({
                        y: geometry.paths[0][0][1],
                        x: geometry.paths[0][0][0],
                        featureType,
                    }), querystring.stringify({
                        y: geometry.paths[0][geometry.paths[0].length - 1][1],
                        x: geometry.paths[0][geometry.paths[0].length - 1][0],
                        featureType,
                    }),
                ]);
        default:
            return [];
    }
};

const createRailwayAddress = address => (
    `${(address.etaisyys - (address.etaisyys % 10000)) / 10000}+
    ${address.etaisyys % 10000}, 
    ${address.kunta_nimi}`
);

const createRoadAddress = address => (
    `${strings.modalShowAddress.road}=${address.tie}, 
    ${strings.modalShowAddress.lane}=${address.ajorata}, 
    ${strings.modalShowAddress.part}=${address.osa}, 
    ${strings.modalShowAddress.distance}=${address.etaisyys}`
);

/**
 * Adds address attribute to features data.
 *
 * @param {Object} data Feature layer data without address.
 * @param {string} featureType Type of feature (road | street | water | railway).
 * @param {string} addressField Name of layers address field.
 *
 * @returns {Promise|Promise} Promise with feature data, including address field or
 * passed feature data if layer doesn't have feature type or address field.
 */
export const createAddressFields = (
    data: Object,
    featureType: string,
    addressField: string,
): Promise<Object> => new Promise((resolve) => {
    if (!featureType || !addressField || !data.geometry) {
        resolve(data);
    } else {
        const geoconvertQueryParams = createGeoconvertParams(
            data.geometry,
            data.geometry.type,
            featureType,
        );

        const geoconvertFetches = geoconvertQueryParams.map(params => fetchGetGeoconvert(params));

        Promise.all(geoconvertFetches).then((r) => {
            if (r.length) {
                let convertedAddress = [];
                switch (featureType) {
                    case 'road':
                        convertedAddress = r.map(address => (
                            address.osoite
                                ? address.osoite
                                : null
                        ));
                        break;
                    case 'street':
                        convertedAddress = r.map(address => (
                            address.osoite
                                ? `${address.osoite}, ${address.kunta}`
                                : null
                        ));
                        break;
                    case 'road2':
                        convertedAddress = r.map(address => (
                            address.tie
                                ? createRoadAddress(address)
                                : null
                        ));
                        break;
                    case 'railway':
                        convertedAddress = r.map(address => (
                            address.kunta_nimi
                                ? `${address.kunta_nimi} - ${address.urakka_nimi}`
                                : null
                        ));
                        break;
                    case 'railway2':
                        convertedAddress = r.map(address => (
                            address.kunta_nimi
                                ? createRailwayAddress(address)
                                : null
                        ));
                        break;
                    default:
                        convertedAddress = r.map(() => null);
                }
                data.attributes[addressField] = convertedAddress.join(', ');
            }

            resolve(data);
        });
    }
});
