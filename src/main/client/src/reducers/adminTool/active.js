// @flow
import { SET_ACTIVE_ADMIN_TOOL } from '../../constants/actionTypes';

const initialState = '';

type State = string;

type Action = {
    layerId: string,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_ACTIVE_ADMIN_TOOL:
            return state === action.layerId ? '' : action.layerId;
        default:
            return state;
    }
};
