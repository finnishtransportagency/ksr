// @flow
import { config } from '../config';

/**
* Calls arcGIS Server's updateFeatures endpoint.
*
* @param {string} layerId Id of the corresponding layer.
* @param {string} params Params to be sent in the request.
*
* @return {Promise<Object>} Promise with update response data.
*/
export const updateFeatures = (layerId: string, params: string): Promise<any> => (
    fetch(`api/proxy/layer/${layerId}/updateFeatures`, {
        ...config('x-www-form-urlencoded'),
        method: 'POST',
        body: params,
    }).then(res => res.json())
);
