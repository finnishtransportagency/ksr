import { getHeaders } from '../config';

/**
 * Saves workspace to database.
 *
 * @param {Object} data Workspace data created with createWorkspaceJsonBody method.
 *
 * @returns {Object} Contains workspace names and last updated times.
 */
export const fetchSaveWorkspace = data => (
    fetch('api/workspace', {
        headers: getHeaders(),
        method: 'POST',
        body: JSON.stringify(data),
    })
        .then(r => r.json())
);
