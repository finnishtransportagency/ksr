// @flow
import { GET_ACTIVE_LAYER_TAB, SET_ACTIVE_LAYER_TAB } from '../../constants/actionTypes';

const initialState = 'active';

type Action = {
    tab: string,
    type: string,
};

export default (state: string = initialState, action: Action) => {
    let newState = state;
    switch (action.type) {
        case GET_ACTIVE_LAYER_TAB:
            return state;
        case SET_ACTIVE_LAYER_TAB:
            newState = action.tab;
            return newState;
        default:
            return state;
    }
};
