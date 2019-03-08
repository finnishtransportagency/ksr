// @flow
import { config } from '../config';

/**
 * Delete user layer from the database.
 *
 * @param {string} layerId Layer's id.
 *
 * @returns {Promise<Object>} Promise response data.
 */
export const deleteUserLayer = (layerId: string) => (
    fetch(`api/user-layer/${encodeURIComponent(layerId)}`, {
        ...config(),
        method: 'DELETE',
    })
        .then(res => res)
);
