import { setFeatureData } from '../../reducers/table/actions';
import { getHeaders } from '../config';

/**
 * Finds all features from layer with given search values
 *
 * @param layerId Layer id (ID in database) that is used in fetch URL
 * @param queryString Parsed query string that is used in fetch URL
 * @param data Data object with empty layer array (added so it works with parseData method)
 *
 * @returns Data that can be used in parseData method to add it to the table
 */
export const fetchSearchQuery = (layerId, queryString, data) =>
    fetch(`api/proxy/layer/${layerId}/query?where=${queryString}&f=pjson&outFields=*`, { headers: getHeaders() })
        .then(r => r.json())
        .then((r) => {
            if (!r.error && r.features.length > 0) data.layers.push({ ...r, id: layerId });
            return data;
        })
        .then((r) => {
            setFeatureData(r);
            return data;
        })
        .catch(err => console.log(err));

