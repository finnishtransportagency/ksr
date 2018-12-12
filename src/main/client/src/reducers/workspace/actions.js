// @flow
import moment from 'moment';
import * as types from '../../constants/actionTypes';

/**
 * Handles workspace fetches and workspace list update.
 *
 * @param {Function} workspaceFetch Workspace fetch
 * (fetchDeleteWorkspace | fetchSaveWorkspace | fetchGetWorkspaceList).
 * @param {Object|string} [fetchParam] Parameter passed to fetch.
 */
export const updateWorkspaces = (
    workspaceFetch: Function,
    fetchParam: Object | string,
) => (dispatch: Function) => {
    dispatch({ type: types.GET_WORKSPACE_LIST });
    workspaceFetch(fetchParam)
        .then((r) => {
            if (!r.error) {
                const workspaceList = r.map(w => ({
                    ...w,
                    updated: moment(w.updateTime).format('DD.MM.YYYY HH:mm'),
                }));
                dispatch({
                    type: types.GET_WORKSPACE_LIST_FULFILLED,
                    workspaceList,
                });
            } else {
                dispatch({
                    type: types.GET_WORKSPACE_LIST_REJECTED,
                });
                throw new Error('GET_WORKSPACE_LIST_REJECTED -error');
            }
        })
        .catch(err => console.log(err));
};

export const setWorkspace = () => (dispatch: Function) => {
    dispatch({ type: types.CLEAR_TABLE_DATA });
    dispatch({ type: types.SET_WORKSPACE });
};

export const setWorkspaceRejected = () => (dispatch: Function) => {
    dispatch({ type: types.SET_WORKSPACE_REJECTED });
};
