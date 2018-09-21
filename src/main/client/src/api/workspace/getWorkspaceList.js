import { config } from '../config';

/**
 * Gets all workspaces that belong to the current user.
 *
 * @return {Object} Contains workspace names and last updated times.
 */
export const fetchGetWorkspaceList = () => (
    fetch('api/workspace/list', config())
        .then((r) => {
            if (r.ok) {
                return r.json();
            }
            return null;
        })
        .catch(err => console.log(err))
);
