// @flow
import { GET_ACTIVE_LAYERS, SET_ACTIVE_LAYERS, GET_ACTIVE_LAYERS_FULFILLED } from '../../constants/actionTypes';

type State = {
    activeLayers: Array<any>,
    fetching: boolean,
};

type Action = {
    type: string,
    tab: string,
    payload: Array<any>,
};

const initialState = {
    activeLayers: [],
    fetching: true,
};

export default (state: State = initialState, action: Action) => {
    let newState = state;
    switch (action.type) {
        case GET_ACTIVE_LAYERS:
            return state;
        case GET_ACTIVE_LAYERS_FULFILLED:
            return {
                ...state,
                activeLayers: action.payload,
                fetching: false,
            };
        case SET_ACTIVE_LAYERS:
            newState = action.tab;
            return newState;
        default:
            return state;
    }
};
