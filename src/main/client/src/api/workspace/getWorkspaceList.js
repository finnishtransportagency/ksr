import { config } from '../config';

/**
 * Gets all workspaces that belong to the current user.
 *
 * @return object with workspace name and last updated time
 */
export const fetchGetWorkspaceList = () => (
    fetch('api/workspace/list', config())
        .then(r => r.json())
        .catch(err => console.log(err))
);
