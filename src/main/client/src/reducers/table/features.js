// @flow
import clone from 'clone';

import {
    CLEAR_TABLE_DATA,
    DE_SELECT_SELECTED_FEATURES,
    SEARCH_FEATURES_FULFILLED,
    SELECT_FEATURES,
    SET_ACTIVE_ADMIN_TOOL,
    SET_ACTIVE_TABLE,
    SET_COLUMNS,
    SET_EDITED_LAYER,
    SET_LAYER_LIST,
    SET_SINGLE_LAYER_GEOMETRY,
    TOGGLE_SELECT_ALL,
    TOGGLE_SELECTION,
    APPLY_EDITS,
    APPLY_DELETED_FEATURES,
    CLEAR_SEARCH_DATA,
} from '../../constants/actionTypes';
import {
    deSelectFeatures,
    mergeLayers,
    syncWithLayersList,
    toggleSelectAll,
    toggleSelection,
    updateLayerColumns,
} from '../../utils/parseFeatureData';
import { applyEdits, applyDeletedFeatures } from '../../utils/table';

type State = {
    fetching: boolean,
    layers: Array<Object>,
    editedLayers: Array<Object>,
    activeTable: string,
    singleLayerGeometry: Object,
};

type Action = {
    type: string,
    layers: any,
    columns: Array<Object>,
    activeTable: string,
    layerList: Array<Object>,
    layerId: string,
    feature: Object,
    search: boolean,
    data: Object,
    geometry: Object,
    edits: Array<Object>,
    objectIds: string,
};

const initialState = {
    layers: [],
    editedLayers: [],
    activeTable: '',
    fetching: false,
    singleLayerGeometry: {},
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SELECT_FEATURES:
            return {
                ...state,
                ...mergeLayers(state.layers, action.layers, state.activeTable),
            };
        case SET_ACTIVE_TABLE:
            return {
                ...state,
                activeTable: action.activeTable,
            };
        case SET_COLUMNS:
            return {
                ...state,
                layers: updateLayerColumns(state.activeTable, action.columns, state.layers),
                editedLayers: updateLayerColumns(state.activeTable, action.columns, state.layers),
            };
        case SEARCH_FEATURES_FULFILLED:
            return {
                ...state,
                ...mergeLayers(state.layers, action.layers, state.activeTable, true),
            };
        case SET_LAYER_LIST:
            return {
                ...state,
                ...syncWithLayersList(state.layers, action.layerList, state.activeTable),
            };
        case DE_SELECT_SELECTED_FEATURES:
            return {
                ...state,
                ...deSelectFeatures(state.layers, state.activeTable),
            };
        case TOGGLE_SELECTION:
            return {
                ...state,
                layers: toggleSelection(state.layers, action.feature),
                editedLayers: toggleSelection(state.editedLayers, action.feature),
            };
        case TOGGLE_SELECT_ALL:
            return {
                ...state,
                layers: toggleSelectAll(state.layers, action.layerId),
                editedLayers: toggleSelectAll(state.editedLayers, action.layerId),
            };
        case SET_ACTIVE_ADMIN_TOOL:
            return {
                ...initialState,
                activeTable: state.layers.find(l => l.id === action.layerId && l.type === 'agfl')
                    ? action.layerId : '',
                editedLayers: (state.editedLayers.filter(l =>
                    l.id === action.layerId && l.type === 'agfl'): Object[]),
                layers: (state.layers.filter(l => l.id === action.layerId && l.type === 'agfl'): Object[]),
            };
        case CLEAR_TABLE_DATA:
            return initialState;
        case CLEAR_SEARCH_DATA:
            return {
                ...state,
                layers: (state.layers.filter(l => l.id !== action.layerId): Object[]),
                editedLayers: (state.editedLayers.filter(l => l.id !== action.layerId): Object[]),
            };
        case SET_EDITED_LAYER: {
            const editedLayers = clone(state.editedLayers, true, 3);
            if (editedLayers) editedLayers.find(l => l.id === state.activeTable).data = action.data;
            return {
                ...state,
                editedLayers,
            };
        }
        case SET_SINGLE_LAYER_GEOMETRY:
            return {
                ...state,
                singleLayerGeometry: action.geometry,
            };
        case APPLY_EDITS:
            return {
                ...state,
                layers: applyEdits(state.layers, action.edits),
                editedLayers: applyEdits(state.editedLayers, action.edits),
            };
        case APPLY_DELETED_FEATURES:
            return {
                ...state,
                layers: applyDeletedFeatures(state.layers, action.objectIds, action.layerId),
                editedLayers: applyDeletedFeatures(
                    state.editedLayers,
                    action.objectIds,
                    action.layerId,
                ),
            };
        default:
            return state;
    }
};
