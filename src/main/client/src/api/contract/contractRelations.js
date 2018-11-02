// @flow
import { config } from '../config';

/**
 * Finds all contract relation data linked to feature.
 *
 * @param {number} layerId Layers id.
 * @param {number} objectId Features object id whose contracts to query.
 *
 * @returns {Promise} JSON object containing feature-contract relation data.
 */
export const fetchContractRelation = (layerId: number, objectId: number): Object => (
    fetch(`api/contract/${layerId}/${objectId}`, config())
        .then(r => r.json())
        .catch(err => console.log(err))
);
