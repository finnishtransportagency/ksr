// @flow
import querystring from 'querystring';
import { config } from '../config';

/**
 * Checks if workspace name already exists for the current user.
 *
 * @param {string} workspaceName User given workspace name.
 * @param {any} signal Request signal which can be used to abort the request.
 *
 * @return {Promise<boolean>} Whether the name exists or not.
 */
export const fetchWorkspaceNameExists = (workspaceName: string, signal: any): Promise<any | void> => (
    fetch(`api/workspace/exists?${
        querystring.stringify({
            name: workspaceName,
        })
    }`, {
        ...config(),
        signal,
    })
        .then(r => r.json())
        .catch(err => console.error(err))
);
