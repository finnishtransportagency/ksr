import { getHeaders } from '../config';

/**
 * Finds all features from layer with given search values
 *
 * @param layerId Layer id (ID in database) that is used in fetch URL
 * @param queryString Parsed query string that is used in fetch URL
 * @param title Layer name that will be used in table tab
 * @param data Data object with empty layer array (added so it works with parseData method)
 *
 * @returns Data that can be used in parseData method to add it to the table
 */
export const fetchSearchQuery = (layerId, queryString, title, data) =>
    fetch(`api/proxy/layer/${layerId}/query?where=${encodeURIComponent(queryString)}&f=pjson&outFields=*`, { headers: getHeaders() })
        .then(r => r.json())
        .then((r) => {
            if (!r.error && r.features.length > 0) data.layers.push({ ...r, id: layerId, title });
            return data;
        })
        .catch(err => console.log(err));
