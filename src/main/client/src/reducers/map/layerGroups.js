// @flow
import { GET_LAYER_GROUPS, GET_LAYER_GROUPS_FULFILLED } from '../../constants/actionTypes';

type SubLayers = {
    name: string,
};

type WmsLayer = {
    server: string,
    url: string,
    copyright: string,
    sublayers: Array<SubLayers>
}

type State = {
    layerGroups: Array<WmsLayer>,
    fetching: boolean,
};

type Action = {
    selectedNav: string,
    type: string,
    payload: Array<WmsLayer>,
};

const initialState = {
    layerGroups: [],
    fetching: true,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case GET_LAYER_GROUPS:
            return {
                ...state,
                fetching: true,
            };
        case GET_LAYER_GROUPS_FULFILLED:
            return {
                ...state,
                layerGroups: action.payload,
                fetching: false,
            };
        default:
            return state;
    }
};
