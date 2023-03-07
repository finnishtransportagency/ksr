// @flow
import { config, handleErrors } from '../config';

/**
 * Gets current users info.
 *
 * @returns {Promise} Promise with current users info.
 */
export const fetchGetUserInfo = (): Promise<Object> => (
    fetch('api/user', config())
        .then(handleErrors)
        .then(res => res.json())
        .catch(err => console.error(err))
);
