// @flow
import moment from 'moment';
import { fetchGetWorkspaceList } from '../../api/workspace/getWorkspaceList';
import * as types from '../../constants/actionTypes';

export const getWorkspaceList = () => (dispatch: Function) => {
    dispatch({ type: types.GET_WORKSPACE_LIST });
    fetchGetWorkspaceList()
        .then(r => Object.keys(r).map(workspace => ({
            name: r[workspace],
            updated: moment(workspace).format('MM.DD.YYYY HH:mm'),
        })))
        .then(r => dispatch({
            type: types.GET_WORKSPACE_LIST_FULFILLED,
            workspaceList: r,
        }))
        .catch(err => console.log(err));
};
