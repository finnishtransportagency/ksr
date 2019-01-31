// @flow
import {
    SET_LOADING,
    REMOVE_LOADING,
    SET_LOADING_LAYERS,
    REMOVE_LOADING_LAYER,
    DEACTIVATE_LAYER,
    UPDATE_LAYER,
} from '../../constants/actionTypes';

type State = {
    loading: boolean,
    loadingLayers: string[],
};

type Action = {
    type: string,
    layer: Object,
    layerId: string,
    layerIds: string[],
};

const initialState = {
    loading: false,
    loadingLayers: [],
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case REMOVE_LOADING:
            return {
                ...state,
                loading: false,
            };
        case SET_LOADING_LAYERS:
            return {
                ...state,
                loadingLayers: [...new Set([...state.loadingLayers, ...action.layerIds])],
            };
        case REMOVE_LOADING_LAYER:
            return {
                ...state,
                loadingLayers: (state.loadingLayers
                    .filter(layerId => layerId !== action.layerId): string[]),
            };
        case DEACTIVATE_LAYER:
            return {
                ...state,
                loadingLayers: (state.loadingLayers
                    .filter(layerId => layerId !== action.layerId): string[]),
            };
        case UPDATE_LAYER:
            return {
                ...state,
                loadingLayers: (state.loadingLayers
                    .filter(layerId => layerId !== action.layer.id): string[]),
            };
        default:
            return state;
    }
};
