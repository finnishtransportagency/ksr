// @flow
import { config } from '../config';

/**
 * Adds user layer to the database.
 *
 * @param {Object} layerValues Contains new user layer values.
 *
 * @returns {Promise<Object>} Promise with added layer data.
 */
export const fetchAddUserLayer = (layerValues: Object) => (
    fetch('api/user-layer', {
        ...config(),
        method: 'POST',
        body: JSON.stringify(layerValues),
    })
        .then(r => r.json())
);
