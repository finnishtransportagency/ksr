// @flow
import { config } from '../config';

/**
 * Makes a fetch request to given url.
 *
 * @param {string} url Url to request.
 *
 * @returns {Promise} Promise that will resolve with responses json-content.
 */
export const getFeatureInfo = (url: string) => fetch(url, config())
    .then(res => res.json());
