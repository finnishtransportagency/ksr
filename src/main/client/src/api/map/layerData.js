// @flow
import querystring from 'querystring';
import { config } from '../config';

/**
 * Fetch layer details from database.
 *
 * @param {string} layerId Layer id (ID in database) that is used in fetch URL. In case of search
 * layers base layers data will be fetched.
 *
 * @returns {Promise<Object>} All data found from layer that will be passed to layer list.
 */
export const layerData = (layerId: string): Promise<Object> => (
    fetch(`api/proxy/layer/${layerId.replace('_s', '')}?${
        querystring.stringify({
            f: 'pjson',
        })
    }`, config())
        .then(r => r.json())
        .catch(err => console.log(err))
);
