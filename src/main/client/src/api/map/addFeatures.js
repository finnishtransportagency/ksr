// @flow

/**
* Calls arcGIS Server's addFeatures endpoint.
*
* @param layerId string Id of the corresponding layer
* @param params URLSearchParams URLSearchParams to be sent in the request
*
* @return Promise Returns Promise with json body.
*/
export const addFeatures = (layerId: string, params: URLSearchParams) =>
    fetch(`api/proxy/layer/${layerId}/addFeatures`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        method: 'POST',
        body: params.toString(),
    })
        .then(r => r.json())
        .catch(err => console.error(err));
