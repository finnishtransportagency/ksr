import { config } from '../config';

/**
 * Gets specific workspace or latest workspace if no name given.
 *
 * @param {string} [workspaceName] User given workspace name.
 *
 * @return {Object} Contains single workspaces data.
 */
export const fetchWorkspace = (workspaceName) => {
    if (workspaceName) {
        return fetch(`api/workspace/?workspaceName=${workspaceName}`, config())
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
