// @flow
import { config } from '../config';

/**
 * Get default map config data from the database.
 *
 * @returns {Promise<Object>} Promise with map config data.
 */
export const fetchMapConfig = () => (
    fetch('api/map', config())
        .then(r => r.json())
);
