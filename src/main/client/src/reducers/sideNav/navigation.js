import { SET_ACTIVE_NAV, GET_ACTIVE_NAV } from '../../constants/action-types';

const initialState = {
    active: '',
};

export default (state = initialState, action) => {
    const newState = state;
    switch (action.type) {
        case GET_ACTIVE_NAV:
            return { ...state };
        case SET_ACTIVE_NAV:
            newState.active = state.active === action.payload ? '' : action.payload;
            return { ...newState };
        default:
            return state;
    }
};
