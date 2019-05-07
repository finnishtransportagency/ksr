// @flow
import querystring from 'querystring';
import { config } from '../config';

/**
 * Deletes selected workspace from database.
 *
 * @param {string} workspaceName Workspace to be deleted.
 *
 * @returns {Promise<Object[]>} Promise with remaining workspace names and last updated times.
 */
export const fetchDeleteWorkspace = (workspaceName: string) => (
    fetch(`api/workspace?${
        querystring.stringify({
            workspaceName,
        })
    }`, {
        ...config(),
        method: 'DELETE',
    })
        .then(r => r.json())
);
