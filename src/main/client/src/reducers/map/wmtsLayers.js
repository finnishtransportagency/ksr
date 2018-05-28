// @flow
import { GET_WMTS_LAYERS, SET_WMTS_LAYERS } from '../../constants/actionTypes';
import { mockWmtsLayers } from '../../mock-data/wmtsLayers';

const initialState = mockWmtsLayers;

type WmtsLayer = {
    server: string,
    url: string,
    copyright: string,
    activeLayer: {
        id: string,
    },
};

type State = Array<WmtsLayer>;

type Action = {
    selectedNav: string,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    let newState = state;
    switch (action.type) {
        case GET_WMTS_LAYERS:
            return state;
        case SET_WMTS_LAYERS:
            newState = state;
            return newState;
        default:
            return state;
    }
};
