// @flow

/**
 * Calls arcGIS Server's deleteFeatures endpoint.
 *
 * @param {string} layerId Id of the corresponding layer.
 * @param {string} params Parameters to be sent in the request.
 *
 * @returns {Promise} Promise with json body.
 */
export const deleteFeatures = (layerId: string, params: string) =>
    fetch(`api/proxy/layer/${layerId}/deleteFeatures`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        method: 'POST',
        body: params,
    })
        .then(r => r.json());
