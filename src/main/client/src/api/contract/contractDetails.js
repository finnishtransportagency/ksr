// @flow
import { config, handleErrors } from '../config';

/**
 * Gets all features that relate to given feature on given layer.
 *
 * @param {number} layerId Id of the layer.
 * @param {number} layerObjectId Id of the object, whose contracts to query.
 *
 * @returns {Promise<Object[] | any>} List containing related layers with features.
 */
export const fetchContractDetails = (
    layerId: number,
    layerObjectId: number,
): Promise<Object[] | any> => (
    fetch(`api/contract/details/${layerId}/${layerObjectId}`, config())
        .then(handleErrors)
        .then(r => r.json())
        .catch(err => console.error(err))
);
