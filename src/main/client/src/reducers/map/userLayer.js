// @flow
import { REMOVE_USER_LAYER, REMOVE_USER_LAYER_FULFILLED } from '../../constants/actionTypes';

const initialState = {
    layerToRemove: null,
};

export default (state: Object = initialState, action: Object): any => {
    switch (action.type) {
        case REMOVE_USER_LAYER:
            return {
                ...state,
                layerToRemove: action.layerId,
            };
        case REMOVE_USER_LAYER_FULFILLED:
            return {
                ...state,
                layerToRemove: null,
            };
        default:
            return state;
    }
};
