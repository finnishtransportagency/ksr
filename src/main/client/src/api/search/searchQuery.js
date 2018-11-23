// @flow
import querystring from 'querystring';
import { config, handleErrors } from '../config';

/**
 * Finds all features from layer with given search values.
 *
 * @param {number} layerId Layer id (ID in database) that is used in fetch URL.
 * @param {string} queryString Parsed query string that is used in fetch URL.
 * @param {string} title Layer name that will be used in table tab.
 * @param {Object} data Object with empty layer array (added so it works with parseData method).
 *
 * @returns Data that can be used in parseData method to add it to the table.
 */
export const fetchSearchQuery = (
    layerId: number,
    queryString: string,
    title: string,
    data: Object,
): any =>
    fetch(`api/proxy/layer/${layerId}/query?${
        querystring.stringify({
            where: queryString,
            f: 'pjson',
            outFields: '*',
        })
    }`, config())
        .then(r => r.json())
        .then((r) => {
            if (!r.error && r.features.length > 0) data.layers.push({ ...r, id: layerId, title });
            return data;
        })
        .catch(err => console.log(err));

/**
 * Fetch search suggestions for given column.
 *
 * @param {number} layerId Layer id (ID in database) that is used in fetch URL.
 * @param {string} whereQueryString Parsed query string that is used in fetch URL.
 * @param {string} queryColumn Column which the suggestions are fetched for.
 * @param {any} signal Request signal which can be used to abort the request.
 *
 * @returns {String[]} Suggested search words.
 */
export const fetchSearchSuggestions = (
    layerId: string,
    whereQueryString: string,
    queryColumn: string,
    signal: any,
) => {
    const suggestions = [];
    return fetch(`api/proxy/layer/${layerId}/query?${
        querystring.stringify({
            where: whereQueryString,
            f: 'pjson',
            outFields: queryColumn,
        })
    }`, { ...config(), signal })
        .then(handleErrors)
        .then(r => r.json())
        .then((r) => {
            if (!r.error && r.features.length) {
                r.features.forEach((feature) => {
                    suggestions.push(feature.attributes[queryColumn]);
                });
            }
            return suggestions.slice(0, 10);
        })
        .catch(err => console.log(err));
};

/**
 * Query for finding features with given layer and query string.
 *
 * @param {number} layerId Layer id (ID in database) that is used in fetch URL.
 * @param {string} whereQueryString Parsed query string that is used in fetch URL.
 * @param {any} signal Request signal which can be used to abort the request.
 *
 * @returns {Promise} Promise object that contains features found with given contract number.
 */
export const queryFeatures = (
    layerId: number,
    whereQueryString: string,
    signal: any,
): Promise<any> => fetch(`api/proxy/layer/${layerId}/query?${
    querystring.stringify({
        where: whereQueryString,
        f: 'pjson',
        outFields: '*',
    })
}`, { ...config(), signal })
    .then(handleErrors)
    .then(r => r.json())
    .catch(err => console.log(err));
