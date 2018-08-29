// @flow
import { SET_GRAPH_LAYER, SET_MAP_VIEW, REMOVE_LAYER_FROM_VIEW } from '../../constants/actionTypes';

const initialState = {};

type Action = {
    type: string,
    view: any,
    graphicsLayer: Object,
    layerId: string,
};

export default (state: Object = initialState, action: Action) => {
    switch (action.type) {
        case SET_MAP_VIEW:
            return {
                ...state,
                view: action.view,
            };
        case SET_GRAPH_LAYER:
            return {
                ...state,
                graphicsLayer: action.graphicsLayer,
            };
        case REMOVE_LAYER_FROM_VIEW:
            state.view.map.layers.remove(state.view.map.allLayers
                .find(l => l.id === action.layerId));
            return state;
        default:
            return state;
    }
};
