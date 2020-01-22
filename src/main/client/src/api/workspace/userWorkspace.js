// @flow
import { toast } from 'react-toastify';
import { config } from '../config';
import strings from '../../translations';

/**
 * Gets specific workspace or latest workspace if no name given.
 *
 * @param {?string} workspaceName User given workspace name.
 * @param {boolean} isPublic Whether the workspace is public or not.
 *
 * @return {Promise<Object>} Contains single workspaces data.
 */
export const fetchWorkspace = (workspaceName: ?string, isPublic: boolean) => {
    if (workspaceName) {
        return fetch(`api/workspace/?workspaceName=${workspaceName}&isPublic=${String(isPublic)}`, config())
            .then((r) => {
                if (r.ok) {
                    return r.json();
                }
                return null;
            })
            .catch(err => console.log(err));
    }
    return fetch('api/workspace', config())
        .then((r) => {
            if (r.ok) {
                return r.json();
            }
            return null;
        })
        .catch(err => console.log(err));
};

/**
 * Gets workspace with workspace uuid.
 *
 * @param {string} workspaceUuid Unique identifier for a workspace.
 *
 * @returns {Promise<Object> | Promise<null>} Promise object with found workspace or null.
 */
export const getWorkspaceUuid = async (workspaceUuid: string) => {
    const res = await fetch(`api/workspace/${workspaceUuid}`, config());
    if (!res.ok) {
        toast.error(strings.workspace.share.sharedWorkspaceLoadError);
        return null;
    }
    return res.json();
};
