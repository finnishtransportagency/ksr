import { config } from '../config';

/**
 * Finds all fields connected to layer
 *
 * @param layerId Layer id (ID in database) that is used in fetch URL
 *
 * @returns All fields found from layer, that will be passed to layerList
*/
export const fetchSearchFields = layerId =>
    fetch(`api/proxy/layer/${layerId}?f=pjson`, config())
        .then(r => r.json())
        .then(r => r.fields.map((f, i) => ({
            value: i, label: f.alias, type: f.type, name: f.name,
        })))
        .catch(err => console.log(err));
