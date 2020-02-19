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
    SET_LAYER_LIST,
    SET_WORKSPACE_FULFILLED,
    APPLY_DELETED_FEATURES,
    CLEAR_SEARCH_DATA,
    TOGGLE_LAYER,
    UPDATE_LAYER,
    DEACTIVATE_LAYER,
    UPDATE_LAYER_FIELDS,
    CLOSE_LAYER,
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

type Layer = {
    active: boolean,
    attribution: string,
    authentication: any,
    alfrescoLinkField: string,
    caseManagementLinkField: string,
    geometryType: string,
    fields: Array<Object>,
    failOnLoad: boolean,
    id: string,
    layerGroupName: string,
    layerOrder: number,
    layers: string,
    layerPermission: Object,
    maxScale: number,
    minScale: number,
    name: string,
    opacity: number,
    propertyIdField: string,
    queryColumnsList: Array<string>,
    queryable: boolean,
    styles: string,
    transparent: boolean,
    type: string,
    updaterField: string,
    url: string,
    visible: boolean,
    _source: string,
}

type State = {
    layerGroups: Array<LayerGroups>,
    fetching: boolean,
    layerList: Array<Layer>,
};

type Action = {
    selectedNav: string,
    type: string,
    layerGroups: Array<LayerGroups>,
    layerList: Array<Layer>,
    layerIds: Array<string>,
    layers: Array<Object>,
    layerId: string,
    layer: Object,
    workspace: Object,
    failOnLoad: boolean,
    fields: Object[],
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
                    visible: action.layerIds.find(id => id === l.id && l.type !== 'agfl')
                        ? false
                        : l.visible,
                })): Array<Object>),
            };
        case ADD_SEARCH_RESULTS_LAYER:
            return {
                ...state,
                layerList: addOrReplaceLayers(state.layerList, action.layers),
                layerGroups: addOrReplaceLayersInSearchGroup(state.layerGroups, action.layers),
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
                layerList: ((state.layerList
                    .map((l: Object) => {
                        if (l.type === 'agfl' && l.active) {
                            return { ...l, active: false };
                        }

                        // Make removed search layer's source layer visible.
                        if (state.layerList.filter(ll => ll._source === 'search')
                            .some(ll => ll.id.replace('.s', '') === l.id)) {
                            return { ...l, visible: true };
                        }
                        return { ...l };
                    }).filter(l => l._source !== 'search'): Array<Layer>): Object[]),
            };
        case CLOSE_LAYER:
            /* eslint-disable */
            const foundLayer: Object = state.layerList.find(layer => layer.id === action.layerId);
            const filteredSearch = (state.layerList
                .filter(layer => layer.id !== action.layerId)
                .map(layer => {
                    if (layer.id === action.layerId.replace('.s', '')) {
                        return {
                            ...layer,
                            visible: layer.active ? true : layer.visible,
                        }
                    }
                    return { ...layer };
                }): Object[]);
            const filteredAgfl = (state.layerList.map((layer) => {
                if (foundLayer.type === 'agfl' && foundLayer.id === layer.id) {
                    return {
                        ...layer,
                        active: false,
                    };
                }
                return { ...layer };
            }): Object[]);
            /* eslint-enable */

            if (foundLayer && (foundLayer._source === 'search' || foundLayer.type === 'agfl')) {
                return {
                    ...state,
                    layerGroups: (state.layerGroups.map(lg => ({
                        ...lg,
                        layers: foundLayer._source === 'search'
                            ? lg.layers.filter(layer => layer.id !== action.layerId)
                            : lg.layers,
                    })): Array<LayerGroups>),
                    layerList: foundLayer._source === 'search'
                        ? filteredSearch
                        : filteredAgfl,
                };
            }

            return { ...state };
        case CLEAR_SEARCH_DATA:
            return {
                ...state,
                layerGroups: (state.layerGroups.map(lg => ({
                    ...lg,
                    layers: lg.layers.filter(l => l.id !== action.layerId),
                })): Array<LayerGroups>),
                layerList: (state.layerList
                    .filter(l => l.id !== action.layerId)
                    .map(l => ({
                        ...l,
                        visible: l.id === action.layerId.replace('.s', '')
                            ? true
                            : l.visible,
                    })): Array<Layer>),
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
                layerList: (state.layerList.filter(l => l.id !== action.layerId): Array<Layer>),
            };
        case SET_WORKSPACE_FULFILLED:
            return {
                ...state,
                layerList: updateLayerList(action.workspace, state.layerList),
                layerGroups: (state.layerGroups.map(lg => ({
                    ...lg,
                    layers: lg.layers.filter(l => l._source !== 'shapefile'),
                })): Array<LayerGroups>),
            };
        case APPLY_DELETED_FEATURES:
            return {
                ...state,
                layerGroups: (state.layerGroups.map(lg => ({
                    ...lg,
                    layers: lg.type === 'search' ? [] : lg.layers,
                })): Array<LayerGroups>),
                layerList: (state.layerList.filter(l => l._source !== 'search'): Array<Layer>),
            };
        case TOGGLE_LAYER:
            return {
                ...state,
                layerList: (state.layerList.map((l) => {
                    if (l.id === action.layerId) {
                        return {
                            ...l,
                            visible: l.active ? !l.visible : true,
                            active: true,
                        };
                    }
                    return { ...l };
                }): Array<Layer>),
            };
        case UPDATE_LAYER:
            return {
                ...state,
                layerList: (state.layerList.map((l) => {
                    if (l.id === action.layer.id) {
                        return { ...action.layer };
                    }
                    return { ...l };
                }): Array<Layer>),
            };
        case UPDATE_LAYER_FIELDS:
            return {
                ...state,
                layerList: (state.layerList.map((l) => {
                    if (l.id === action.layerId) {
                        return {
                            ...l,
                            fields: action.fields,
                        };
                    }
                    return { ...l };
                }): Array<Layer>),
            };
        case DEACTIVATE_LAYER:
            return {
                ...state,
                layerList: (state.layerList.map((l) => {
                    if (l.id === action.layerId) {
                        return {
                            ...l,
                            active: false,
                            visible: false,
                            failOnLoad: action.failOnLoad ? action.failOnLoad : false,
                        };
                    }

                    if (action.layerId.endsWith('.s') && action.layerId.replace('.s', '') === l.id) {
                        return {
                            ...l,
                            visible: true,
                        };
                    }

                    return { ...l };
                }): Array<Layer>),
            };
        default:
            return state;
    }
};
