import querystring from 'querystring';
import { config } from '../config';

/**
 * Deletes selected workspace from database.
 *
 * @param {string} workspaceName Workspace to be deleted.
 *
 * @returns {Object} Contains workspace names and last updated times.
 */
export const fetchDeleteWorkspace = workspaceName => (
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
