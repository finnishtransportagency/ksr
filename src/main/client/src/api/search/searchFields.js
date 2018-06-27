import { getHeaders } from '../config';

/**
 * Finds all fields connected to layer
 *
 * @param layerId Layer id (ID in database) that is used in fetch URL
 *
 * @returns All fields found from layer, that will be passed to layerList
*/
export const fetchSearchFields = layerId =>
    fetch(`api/proxy/layer/${layerId}?f=pjson`, { headers: getHeaders() })
        .then(r => r.json())
        .then((r) => {
            const fields = [];
            r.fields.forEach((f, i) =>
                fields.push({
                    value: i,
                    label: f.alias,
                }));
            return fields;
        })
        .catch(err => console.log(err));
