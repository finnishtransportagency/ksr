// @flow
import { config } from '../config';

/**
 * Calls arcGIS Server's deleteFeatures endpoint.
 *
 * @param {string} layerId Id of the corresponding layer.
 * @param {string} params Parameters to be sent in the request.
 *
 * @returns {Promise<Object>} Promise with json body.
 */
export const deleteFeatures = (layerId: string, params: string): Promise<any> => (
    fetch(`api/proxy/layer/${layerId}/deleteFeatures`, {
        ...config('x-www-form-urlencoded'),
        method: 'POST',
        body: params,
    })
        .then(r => r.json())
);
