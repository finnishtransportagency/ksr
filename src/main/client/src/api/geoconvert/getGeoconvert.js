// @flow
import { config } from '../config';

/**
 * Converts feature coordinates to address.
 *
 * @param {string} queryParams Query string that contains x, y and featureType.
 *
 * @returns {Promise<Object>} The data returned from geoconvert.
 */
export const fetchGetGeoconvert = (queryParams: string): Promise<Object> => (
    fetch(`api/geoconvert?${queryParams}`, config())
        .then(r => r.json())
        .catch(err => console.log(err))
);
