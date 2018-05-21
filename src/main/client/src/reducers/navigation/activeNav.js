import { SET_ACTIVE_NAV, GET_ACTIVE_NAV } from '../../constants/actionTypes';

const initialState = '';

export default (state = initialState, action) => {
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
