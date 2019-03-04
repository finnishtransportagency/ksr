import querystring from 'querystring';
import { config } from '../config';

/**
 * Finds layer
 *
 * @param layerId Layer id (ID in database) that is used in fetch URL
 *
 * @returns All data found from layer, that will be passed to layerList
 */
export const layerData = layerId =>
    fetch(`api/proxy/layer/${layerId.replace('.s', '')}?${
        querystring.stringify({
            f: 'pjson',
        })
    }`, config())
        .then(r => r.json())
        .catch(err => console.log(err));
