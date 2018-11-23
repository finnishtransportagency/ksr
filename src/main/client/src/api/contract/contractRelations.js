// @flow
import { config, handleErrors } from '../config';

/**
 * Gets contract relation data.
 *
 * @param {number} layerId Layers id.
 * @param {number} objectId Features object id whose contracts to query.
 *
 * @returns {Promise} JSON object containing feature-contract relation data.
 */
export const fetchContractRelation = (layerId: number, objectId: number): any => (
    fetch(`api/contract/${layerId}/${objectId}`, config())
        .then(handleErrors)
        .then(r => r.json())
        .catch(err => console.log(err))
);
