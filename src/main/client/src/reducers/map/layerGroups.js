// @flow
import {
    ADD_SEARCH_RESULTS_LAYER,
    ADD_SHAPEFILE_LAYER,
    ADD_USER_LAYER,
    CLEAR_TABLE_DATA,
    GET_LAYER_GROUPS,
    GET_LAYER_GROUPS_FULFILLED,
    HIDE_LAYER,
    REMOVE_USER_LAYER_FULFILLED,
    SET_ACTIVE_ADMIN_TOOL,
    SET_LAYER_LIST,
    SET_WORKSPACE_FULFILLED,
} from '../../constants/actionTypes';

import { addLayerToUserGroup, addOrReplaceLayers, addOrReplaceLayersInSearchGroup } from '../../utils/layers';
import { updateLayerList } from '../../utils/workspace/loadWorkspace';

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
    layer: Object,
    workspace: Object,
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
                    layers: lg.type === 'search' ? [] : lg.layers
                        .map((l) => {
                            if (l.type === 'agfl' && l.active) {
                                return { ...l, active: false };
                            }
                            return { ...l };
                        }),
                })): Array<LayerGroups>),
                layerList: ((state.layerList.filter(l => l._source !== 'search'): Array<LayerList>)
                    .map((l: Object) => {
                        if (l.type === 'agfl' && l.active) {
                            return { ...l, active: false };
                        }
                        return { ...l };
                    }): Object[]),
            };
        case ADD_SHAPEFILE_LAYER:
            return {
                ...state,
                layerList: [action.layer, ...state.layerList],
                layerGroups: addLayerToUserGroup(state.layerGroups, action.layer),

            };
        case ADD_USER_LAYER:
            return {
                ...state,
                layerList: [action.layer, ...state.layerList],
                layerGroups: addLayerToUserGroup(state.layerGroups, action.layer),
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
        case SET_WORKSPACE_FULFILLED:
            return {
                ...state,
                layerList: updateLayerList(action.workspace, state.layerList),
            };
        default:
            return state;
    }
};
