// @flow
import { config } from '../config';

/**
 * Calls arcGIS Server's addFeatures endpoint.
 *
 * @param {string} layerId Id of the corresponding layer.
 * @param {string} params Params to be sent in the request.
 *
 * @returns {Promise<Object>} Returns Promise with json body.
*/
export const addFeatures = (layerId: string, params: string) => (
    fetch(`api/proxy/layer/${layerId}/addFeatures`, {
        ...config(),
        method: 'POST',
        body: params,
    })
        .then(r => r.json())
);
