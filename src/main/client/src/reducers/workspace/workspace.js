// @flow
import { GET_WORKSPACE_LIST, GET_WORKSPACE_LIST_FULFILLED } from '../../constants/actionTypes';

type State = {
    workspaceList: Array<Object>,
    fetching: boolean,
};

type Action = {
    type: string,
    workspaceList: Array<Object>,
};

const initialState = {
    workspaceList: [],
    fetching: false,
};

export default (state: State = initialState, action: Action) => {
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
        default:
            return state;
    }
};
