import querystring from 'querystring';
import { getHeaders } from '../config';

/**
 * Deletes selected workspace from database.
 *
 * @param workspaceName workspace to be deleted
 */
export const fetchDeleteWorkspace = workspaceName => fetch(`api/workspace?${
    querystring.stringify({
        workspaceName: encodeURIComponent(workspaceName),
    })
}`, {
    headers: getHeaders(),
    method: 'DELETE',
});
