// @flow
import { config } from '../config';

/**
 * Saves workspace to database.
 *
 * @param {Object} data Workspace data created with createWorkspaceJsonBody method.
 *
 * @returns {Promise<Object[]>} Contains workspace names and last updated times.
 */
export const fetchSaveWorkspace = (data: Object): Promise<any> => (
    fetch('api/workspace', {
        ...config(),
        method: 'POST',
        body: JSON.stringify(data),
    })
        .then(r => r.json())
);
