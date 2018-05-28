// @flow
import { GET_WMS_LAYERS, SET_WMS_LAYERS } from '../../constants/actionTypes';
import { mockWmsLayers } from '../../mock-data/wmsLayers';

const initialState = mockWmsLayers;

type SubLayers = {
    name: string,
};

type WmsLayer = {
    server: string,
    url: string,
    copyright: string,
    sublayers: Array<SubLayers>
}

type State = Array<WmsLayer>;

type Action = {
    selectedNav: string,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    let newState = state;
    switch (action.type) {
        case GET_WMS_LAYERS:
            return state;
        case SET_WMS_LAYERS:
            newState = state === action.selectedNav ? '' : action.selectedNav;
            return newState;
        default:
            return state;
    }
};
