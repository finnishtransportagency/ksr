// @flow
import {
    CLEAR_SEARCH_DATA,
    CLEAR_TABLE_DATA,
    CLOSE_LAYER,
    REMOVE_LAYER_FROM_VIEW,
    SET_GRAPH_LAYER,
    SET_MAP_VIEW,
    TOGGLE_LAYER_VISIBLE_ZOOM_OUT,
} from '../../constants/actionTypes';

const initialState = {
    layersVisibleZoomOut: [],
};

type Action = {
    type: string,
    view: any,
    graphicsLayer: Object,
    layerIds: Array<any>,
    layerId: string,
    originalMinScale: number,
};

const toggleLayerVisibleZoomOut = (state, action) => {
    let layersVisibleZoomOut = state.layersVisibleZoomOut || [];
    const stored = layersVisibleZoomOut.find(l => l.id === action.layerId);

    const layers = state.view.map.layers.map((item) => {
        if (item.id === action.layerId) {
            item.minScale = stored ? stored.original : Number.MAX_VALUE;
        }
        return item;
    });

    if (!stored) {
        layersVisibleZoomOut = [
            ...state.layersVisibleZoomOut,
            { id: action.layerId, original: action.originalMinScale },
        ];
    } else {
        layersVisibleZoomOut = layersVisibleZoomOut
            .filter(l => l.id !== action.layerId);
    }
    return {
        ...state,
        layers,
        layersVisibleZoomOut,
    };
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
                // visible false and opacity 1 after removing the layer which causes problems so
                // as a workaround set layer visibility and opacity before removing the layer.
                if (layer) {
                    layer.visible = false;
                    layer.opacity = 1;
                }
                state.view.map.layers.remove(layer);
            });
            return state;
        case CLEAR_TABLE_DATA:
            if (state.view && state.view.map) {
                state.view.map.layers.removeMany(state.view.map.layers
                    .filter(l => l.id.endsWith('_s')));
            }
            return state;
        case CLOSE_LAYER:
        case CLEAR_SEARCH_DATA:
            if (state.view && state.view.map && action.layerId.endsWith('_s')) {
                state.view.map.layers.removeMany(state.view.map.layers
                    .filter(l => l.id === action.layerId));
            }
            return state;
        case TOGGLE_LAYER_VISIBLE_ZOOM_OUT:
            return toggleLayerVisibleZoomOut(state, action);
        default:
            return state;
    }
};
