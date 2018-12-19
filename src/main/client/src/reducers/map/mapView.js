// @flow
import {
    CLEAR_SEARCH_DATA,
    CLEAR_TABLE_DATA,
    REMOVE_LAYER_FROM_VIEW,
    SET_GRAPH_LAYER,
    SET_MAP_VIEW,
} from '../../constants/actionTypes';

const initialState = {};

type Action = {
    type: string,
    view: any,
    graphicsLayer: Object,
    layerIds: Array<any>,
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
            action.layerIds.forEach((layerId) => {
                const layer = state.view.map.layers.find(l => l.id === layerId);
                // TODO: Remove workaround once this is fixed in the API.
                // In ArcGIS JS API 4.10 when removing WMTS layers the library tries to set
                // visible value false after removing the layer which causes problems so
                // as a workaround set layer visibility false before removing the layer.
                layer.visible = false;
                state.view.map.layers.remove(layer);
            });
            return state;
        case CLEAR_TABLE_DATA:
            if (state.view && state.view.map) {
                state.view.map.layers.removeMany(state.view.map.layers.filter(l =>
                    l.id.endsWith('.s')));
            }
            return state;
        case CLEAR_SEARCH_DATA:
            if (state.view && state.view.map) {
                state.view.map.layers.removeMany(state.view.map.layers.filter(l =>
                    l.id === action.layerId));
            }
            return state;
        default:
            return state;
    }
};
