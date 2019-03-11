// @flow
import { config } from '../config';

/**
 * Makes a fetch request to given url.
 *
 * @param {string} url Url to request.
 *
 * @returns {Promise<Object>} Promise that will resolve with responses json-content.
 */
export const getFeatureInfo = (url: string) => fetch(url, config())
    .then(res => res.json())
    .catch((error) => {
        console.error(error);
        return undefined;
    });
