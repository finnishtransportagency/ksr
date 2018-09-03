import { getHeaders } from '../config';

/**
 * Saves workspace to database.
 *
 * @param data Workspace data created with createWorkspaceJsonBody method
 */
export const fetchSaveWorkspace = data => fetch('api/workspace', {
    headers: getHeaders(),
    method: 'POST',
    body: JSON.stringify(data),
});
