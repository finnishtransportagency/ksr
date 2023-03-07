// @flow
import { SET_ACTIVE_NAV, GET_ACTIVE_NAV, SET_PROPERTY_INFO } from '../../constants/actionTypes';

const initialState = '';

type State = string;

type Action = {
    selectedNav: string,
    type: string,
};

export default (state: State = initialState, action: Action): string | State => {
    switch (action.type) {
        case GET_ACTIVE_NAV:
            return state;
        case SET_ACTIVE_NAV:
            return state === action.selectedNav ? '' : action.selectedNav;
        case SET_PROPERTY_INFO:
            return 'search';
        default:
            return state;
    }
};
