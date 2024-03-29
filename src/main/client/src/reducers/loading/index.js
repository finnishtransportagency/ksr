// @flow
import {
    SET_LOADING,
    REMOVE_LOADING,
    SET_LOADING_LAYERS,
    REMOVE_LOADING_LAYER,
    REMOVE_LOADING_LAYERS,
    DEACTIVATE_LAYER,
    UPDATE_LAYER,
} from '../../constants/actionTypes';

type State = {
    loading?: boolean,
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

export default (state: State = initialState, action: Action): State | { loading: boolean, loadingLayers: Array<string>, ... } => {
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
                loadingLayers: (state.loadingLayers?.filter(layerId => layerId !== action.layerId): string[]),
            };
        case REMOVE_LOADING_LAYERS:
            return {
                ...state,
                loadingLayers: (state.loadingLayers
                    .filter(layerId => !action.layerIds
                        .some(id => id === layerId)): string[]),
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
