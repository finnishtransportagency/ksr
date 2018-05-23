// @flow
import { SET_ACTIVE_NAV, GET_ACTIVE_NAV } from '../../constants/actionTypes';

const initialState = '';

type State = string;

type Action = {
    selectedNav: string,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    let newState = state;
    switch (action.type) {
        case GET_ACTIVE_NAV:
            return state;
        case SET_ACTIVE_NAV:
            newState = state === action.selectedNav ? '' : action.selectedNav;
            return newState;
        default:
            return state;
    }
};
