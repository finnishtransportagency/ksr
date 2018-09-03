import { config } from '../config';

/**
 * Checks if workspace name already exists for the current user.
 *
 * @param workspaceName user given workspace name
 * @param signal Request signal which can be used to abort the request
 *
 * @return boolean of whether the name exists or not
 */
export const fetchWorkspaceNameExists = (workspaceName, signal) => (
    fetch(`api/workspace/exists?name=${workspaceName}`, config(), signal)
        .then(r => r.json())
        .catch(err => console.log(err))
);
