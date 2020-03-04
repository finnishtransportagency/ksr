// @flow
import { SET_ACTIVE_PORTAL } from '../../constants/actionTypes';

const initialState = {
    activePortal: '',
};

type State = {
    activePortal: string,
};

type Action = {
    activePortal: string,
    type: any,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_ACTIVE_PORTAL:
            return {
                ...state,
                activePortal: action.activePortal,
            };
        default:
            return state;
    }
};
