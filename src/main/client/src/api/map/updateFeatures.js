// @flow

/**
* Calls arcGIS Server's updateFeatures endpoint.
*
* @param layerId string Id of the corresponding layer
* @param params URLSearchParams URLSearchParams to be sent in the request
*
* @return Promise Returns Promise with json body.
*/
export const updateFeatures = (layerId: string, params: URLSearchParams) =>
    fetch(`api/proxy/layer/${layerId}/updateFeatures`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        method: 'POST',
        body: params.toString(),
    })
        .then(r => r.json())
        .catch(err => console.error(err));
