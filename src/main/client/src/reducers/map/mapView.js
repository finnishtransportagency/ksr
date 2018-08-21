// @flow
import { SET_GRAPH_LAYER, SET_MAP_VIEW } from '../../constants/actionTypes';

const initialState = {};

type Action = {
    type: string,
    view: any,
    graphicsLayer: Object,
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
        default:
            return state;
    }
};
