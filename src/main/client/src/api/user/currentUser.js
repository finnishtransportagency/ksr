// @flow
import { config } from '../config';

/**
 * Gets current users info.
 *
 * @returns {Promise} Promise with current users info.
 */
export const fetchGetUserInfo = () => (
    fetch('api/user', config())
        .then((r) => {
            if (r.ok) {
                return r.json();
            }
            return null;
        })
        .catch(err => console.log(err))
);
