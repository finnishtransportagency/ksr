// @flow

/**
* Calls arcGIS Server's addFeatures endpoint.
*
* @param {string} layerId Id of the corresponding layer.
* @param {string} params Params to be sent in the request.
*
* @return Promise Returns Promise with json body.
*/
export const addFeatures = (layerId: string, params: string) =>
    fetch(`api/proxy/layer/${layerId}/addFeatures`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        method: 'POST',
        body: params,
    })
        .then(r => r.json());
