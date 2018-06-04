// @flow
import { getActiveLayers } from '../../api/map-layers/activeLayers';
import { GET_ACTIVE_LAYERS, SET_ACTIVE_LAYERS, SET_ACTIVE_LAYER_TAB } from '../../constants/actionTypes';

const initialState = getActiveLayers();

type State = () => void;

type Action = {
    type: string,
    tab: string,
};

export default (state: State = initialState, action: Action) => {
    let newState = state;
    switch (action.type) {
        case GET_ACTIVE_LAYERS:
            return state;
        case SET_ACTIVE_LAYERS:
            newState = action.tab;
            return newState;
        default:
            return state;
    }
};
