// @flow
import {
    GET_WORKSPACE_LIST,
    GET_WORKSPACE_LIST_FULFILLED,
    GET_WORKSPACE_LIST_REJECTED,
    SET_WORKSPACE,
    SET_WORKSPACE_FULFILLED,
    SET_WORKSPACE_REJECTED,
} from '../../constants/actionTypes';

type State = {
    workspaceList: Array<Object>,
    fetching: boolean,
    loadingWorkspace: boolean,
};

type Action = {
    type: string,
    workspaceList: Array<Object>,
    workspace: Object,
};

const initialState = {
    workspaceList: [],
    fetching: false,
    loadingWorkspace: false,
};

export default (state: State = initialState, action: Action): any => {
    switch (action.type) {
        case GET_WORKSPACE_LIST:
            return {
                ...state,
                fetching: true,
            };
        case GET_WORKSPACE_LIST_FULFILLED:
            return {
                ...state,
                workspaceList: action.workspaceList,
                fetching: false,
            };
        case GET_WORKSPACE_LIST_REJECTED:
            return {
                ...state,
                fetching: false,
            };
        case SET_WORKSPACE:
            return {
                ...state,
                loadingWorkspace: true,
            };
        case SET_WORKSPACE_FULFILLED:
            return {
                ...state,
                loadingWorkspace: false,
            };
        case SET_WORKSPACE_REJECTED:
            return {
                ...state,
                loadingWorkspace: false,
            };
        default:
            return state;
    }
};
