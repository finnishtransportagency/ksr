import { getHeaders } from '../config';

/**
 * Deletes selected workspace from database.
 *
 * @param workspaceName workspace to be deleted
 */
export const fetchDeleteWorkspace = workspaceName => fetch(`api/workspace?workspaceName=${encodeURIComponent(workspaceName)}`, {
    headers: getHeaders(),
    method: 'DELETE',
});
