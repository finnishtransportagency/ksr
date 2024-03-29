// @flow
import querystring from 'querystring';
import { convert } from '../../geojson';
import store from '../../../store/index';

const API_URL = 'https://api.digitransit.fi/geocoding/v1/search';

/**
 * Converts a GeoJSON Feature into a AddressCandidate and SuggestionResult
 * compatible Object.
 *
 * @param {Object} feature Feature to convert.
 * @returns {Object} Object conforming both AddressCandidate and SuggestionResult.
 */
const convertFeature = async (feature: Object) => ({
    isCollection: false,
    text: feature.properties.label,
    address: feature.properties.label,
    magicKey: feature.properties.id,
    location: await convert(feature.geometry, 4326, 3067),
    score: feature.properties.confidence * 100,
});

/**
 * Fetch a list of matching addresses from Digitransit Geocoding API.
 *
 * The search-api is used for autocomplete also, because it can handle
 * typos. Result from Digitransit API is converted into ArcGIS JS 4 compatible
 * format.
 *
 * Will resolve with an empty array if error occurs.
 *
 * @param {string} text Search term.
 * @param {number} size Max number of results to be returned.
 * @returns {Promise<Object[]>} Promise of geocoding results.
 */
export const fetchAddresses = (text: string, size: number): Promise<Array<empty>> | Promise<any | Array<empty>> => {
    if (!text) {
        console.error('Empty search term given. Unable to search.');
        return Promise.resolve([]);
    }

    let apiKey = store.getState().map.mapConfig.searchApiKey;
    // hard code apiKey, because Jenkins can't find the credential
    // Api key would be shown in the request address anyways
    if (apiKey === 'DIGITRANSIT_API_KEY') {
        apiKey = '087c73b07b6049ee8c54f322b310cb06';
    }

    const params = querystring.stringify({
        text,
        size,
        'digitransit-subscription-key': apiKey,
        sources: 'openstreetmap,nlsfi,openaddresses',
    });

    return fetch(`${API_URL}?${params}`)
        .then(r => r.json())
        .then(fc => Promise.all(fc.features.map(convertFeature)))
        .catch((reason) => {
            console.error(reason);
            return [];
        });
};
