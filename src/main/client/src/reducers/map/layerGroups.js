// @flow
import {
    GET_LAYER_GROUPS,
    GET_LAYER_GROUPS_FULFILLED,
    SET_LAYER_LIST,
    HIDE_LAYER,
    ADD_SEARCH_RESULTS_LAYER,
    CLEAR_TABLE_DATA,
    SET_ACTIVE_ADMIN_TOOL,
    REMOVE_USER_LAYER_FULFILLED,
} from '../../constants/actionTypes';

import { addOrReplaceLayers, addOrReplaceLayersInSearchGroup } from '../../utils/layers';

type LayerGroups = {
    id: number,
    name: string,
    layers: Array<Object>,
    type: string,
    groupOrder: number,
}

type LayerList = {
    active: boolean,
    attribution: string,
    authentication: any,
    geometryType: string,
    fields: Array<Object>,
    id: string,
    layerOrder: number,
    layers: string,
    maxScale: number,
    minScale: number,
    name: string,
    opacity: number,
    queryColumns: Array<string>,
    queryable: boolean,
    styles: string,
    transparent: boolean,
    type: string,
    url: string,
    visible: boolean,
    _source: string,
}

type State = {
    layerGroups: Array<LayerGroups>,
    fetching: boolean,
    layerList: Array<LayerList>,
};

type Action = {
    selectedNav: string,
    type: string,
    layerGroups: Array<LayerGroups>,
    layerList: Array<LayerList>,
    layerIds: Array<string>,
    layers: Array<Object>,
    layerId: string,
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
        case HIDE_LAYER:
            return {
                ...state,
                layerList: (state.layerList.map(l => ({
                    ...l,
                    visible: action.layerIds.find(id => id === l.id) ? false : l.visible,
                })): Array<Object>),
            };
        case ADD_SEARCH_RESULTS_LAYER:
            return {
                ...state,
                layerList: addOrReplaceLayers(state.layerList, action.layers),
                layerGroups: addOrReplaceLayersInSearchGroup(state.layerGroups, action.layers),
            };
        case SET_ACTIVE_ADMIN_TOOL:
            return {
                ...state,
                layerGroups: (state.layerGroups.map(lg => ({
                    ...lg,
                    layers: lg.type === 'search' ? [] : lg.layers,
                })): Array<LayerGroups>),
                layerList: (state.layerList
                    .filter(l => l._source !== 'search')
                    .map(l => ({
                        ...l,
                        visible: l.id === action.layerId ? true : l.visible,
                    })): any),
            };
        case CLEAR_TABLE_DATA:
            return {
                ...state,
                layerGroups: (state.layerGroups.map(lg => ({
                    ...lg,
                    layers: lg.type === 'search' ? [] : lg.layers,
                })): Array<LayerGroups>),
                layerList: (state.layerList.filter(l => l._source !== 'search'): Array<LayerList>),
            };
        case REMOVE_USER_LAYER_FULFILLED:
            return {
                ...state,
                layerGroups: (state.layerGroups.map(lg => ({
                    ...lg,
                    layers: lg.layers.filter(l => l.id !== action.layerId),
                })): Array<LayerGroups>),
                layerList: (state.layerList.filter(l => l.id !== action.layerId): Array<LayerList>),
            };
        default:
            return state;
    }
};
