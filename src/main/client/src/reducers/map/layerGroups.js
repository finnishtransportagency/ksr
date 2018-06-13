// @flow
import { GET_LAYER_GROUPS, GET_LAYER_GROUPS_FULFILLED, SET_LAYER_LIST } from '../../constants/actionTypes';

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
    layerGroups: Array<any>,
    layerList: Array<any>,
};

const initialState = {
    layerGroups: [],
    layerList: [],
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
                layerGroups: action.layerGroups,
                layerList: action.layerList,
                fetching: false,
            };
        case SET_LAYER_LIST:
            return {
                ...state,
                layerList: action.layerList,
            };
        default:
            return state;
    }
};
