// @flow
import { CLEAR_TABLE_DATA, REMOVE_LAYER_FROM_VIEW, SET_GRAPH_LAYER, SET_MAP_VIEW } from '../../constants/actionTypes';

const initialState = {};

type Action = {
    type: string,
    view: any,
    graphicsLayer: Object,
    layerIds: Array<any>,
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
            action.layerIds.forEach((layerId) => {
                state.view.map.layers.remove(state.view.map.layers
                    .find(l => l.id === layerId));
            });
            return state;
        case CLEAR_TABLE_DATA:
            if (state.view && state.view.map) {
                state.view.map.layers.removeMany(state.view.map.layers.filter(l =>
                    l.id.endsWith('.s')));
            }
            return state;
        default:
            return state;
    }
};
