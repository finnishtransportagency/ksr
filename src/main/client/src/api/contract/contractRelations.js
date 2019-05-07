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

/**
 * Link contract to layer feature.
 *
 * @param {number} layerId Id of the layer whose object to relate.
 * @param {number} layerObjectId Id of the object to relate.
 * @param {number} contractLayerId Id of the contract layer in which to relate.
 * @param {number} contractObjectId Id of the object in which to relate.
 *
 * @returns {Promise<string | null>} Returns 'created' or 'exists' on successful linking depending
 * on whether the link already exists or null if linking is unsuccessful.
 */
export const linkContract = (
    layerId: number,
    layerObjectId: number,
    contractLayerId: number,
    contractObjectId: number,
) => (
    fetch(`api/contract/link/${layerId}/${layerObjectId}/${contractLayerId}/${contractObjectId}`, {
        ...config(),
        method: 'POST',
    })
        .then((res) => {
            if (res.ok && res.status === 201) return 'created';
            if (res.ok && res.status === 200) return 'exists';
            return null;
        })
        .catch(err => console.log(err))
);

/**
 * Unlink contract from layer feature.
 *
 * @param {number} layerId Id of the layer whose object to unrelate.
 * @param {number} layerObjectId Id of the object to unrelate.
 * @param {number} contractLayerId Id of the contract layer in which to unrelate.
 * @param {number} contractObjectId Id of the object in which to unrelate.
 *
 * @returns {Promise<boolean>} Returns true or false depending if unlinking was successful or not.
 */
export const unlinkContract = (
    layerId: number,
    layerObjectId: number,
    contractLayerId: number,
    contractObjectId: number,
): Promise<boolean> => (
    fetch(`api/contract/unlink/${layerId}/${layerObjectId}/${contractLayerId}/${contractObjectId}`, {
        ...config(),
        method: 'POST',
    })
        .then(res => res.ok && res.status === 200)
        .catch((err) => {
            console.log(err);
            return false;
        })
);
