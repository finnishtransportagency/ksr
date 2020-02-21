// @flow
import {
    ADD_FILTERED,
    APPLY_DELETED_FEATURES,
    APPLY_EDITS,
    CLEAR_SEARCH_DATA,
    CLEAR_TABLE_DATA,
    CLOSE_LAYER,
    DE_SELECT_SELECTED_FEATURES,
    DEACTIVATE_LAYER,
    SEARCH_FEATURES_FULFILLED,
    SELECT_FEATURES,
    SET_ACTIVE_ADMIN_TOOL,
    SET_ACTIVE_TABLE,
    SET_COLUMNS,
    SET_EDITED_LAYER,
    SET_LAYER_LIST,
    SET_ROW_FILTER,
    SET_SINGLE_LAYER_GEOMETRY,
    TABLE_EDITED,
    TOGGLE_SELECT_ALL,
    TOGGLE_SELECTION,
} from '../../constants/actionTypes';
import {
    deSelectFeatures,
    getActiveTable,
    mergeLayers,
    setRowFilter,
    syncWithLayersList,
    toggleSelectAll,
    toggleSelection,
    updateLayerColumns,
} from '../../utils/parseFeatureData';
import {
    applyDeletedFeatures,
    applyEditedLayers,
    applyEdits,
    removeFilteredLayer,
    removeFilteredLayers,
} from '../../utils/table';

type State = {
    fetching: boolean,
    layers: Array<Object>,
    editedLayers: Array<Object>,
    activeTable: string,
    singleLayerGeometry: Object,
    hasTableEdited: boolean,
    filtered: Array<Object>
};

type Action = {
    type: string,
    layers: any,
    columns: Array<Object>,
    activeTable: string,
    rows: Array<Object>,
    layerList: Array<Object>,
    layerId: string,
    feature: Object,
    search: boolean,
    data: Object,
    geometry: Object,
    edits: Array<Object>,
    objectIds: string,
    hasTableEdited: boolean,
    filtered: Array<Object>
};

const initialState = {
    layers: [],
    editedLayers: [],
    activeTable: '',
    fetching: false,
    singleLayerGeometry: {},
    hasTableEdited: false,
    filtered: [],
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
        case DEACTIVATE_LAYER:
            return {
                ...state,
                layers: (state.layers.filter(l => l.id !== action.layerId): Object[]),
                editedLayers: (state.editedLayers.filter(l => l.id !== action.layerId)
                    .map(l => (l.id === `${action.layerId}.s`
                        ? state.layers.find(a => a.id === `${action.layerId}.s`)
                        : l)): Object[]),
                activeTable: getActiveTable(
                    state.layers.filter(l => l.id !== action.layerId),
                    state.activeTable,
                ),
                filtered: removeFilteredLayer(state.filtered, action.layerId),
            };
        case DE_SELECT_SELECTED_FEATURES:
            return {
                ...state,
                ...deSelectFeatures(state.layers, state.activeTable),
                filtered: removeFilteredLayers(state.filtered),
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
        case SET_ROW_FILTER:
            return {
                ...state,
                layers: setRowFilter(state.layers, state.activeTable, action.rows),
                editedLayers: setRowFilter(state.editedLayers, state.activeTable, action.rows),
            };
        case SET_ACTIVE_ADMIN_TOOL:
            return {
                ...state,
                editedLayers: state.layers,
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
            return {
                ...state,
                editedLayers: applyEditedLayers(state.editedLayers, action.data),
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
                layers: applyEdits(state.editedLayers, action.edits),
                editedLayers: applyEdits(state.editedLayers, action.edits),
            };
        case APPLY_DELETED_FEATURES:
            return {
                ...state,
                layers: applyDeletedFeatures(
                    state.layers,
                    action.objectIds,
                    action.layerId,
                ),
                editedLayers: applyDeletedFeatures(
                    state.editedLayers,
                    action.objectIds,
                    action.layerId,
                ),
                activeTable: getActiveTable(
                    applyDeletedFeatures(
                        state.layers,
                        action.objectIds,
                        action.layerId,
                    ),
                    state.activeTable,
                ),
            };
        case CLOSE_LAYER:
            return {
                ...state,
                layers: (state.layers.filter(l => l.id !== action.layerId): Object[]),
                editedLayers: (state.editedLayers.filter(l => l.id !== action.layerId)
                    .map(l => (l.id === `${action.layerId}.s`
                        ? state.layers.find(a => a.id === `${action.layerId}.s`)
                        : l)): Object[]),
                activeTable: getActiveTable(
                    state.layers.filter(l => l.id !== action.layerId),
                    state.activeTable,
                ),
                filtered: removeFilteredLayer(state.filtered, action.layerId),
            };
        case TABLE_EDITED:
            return {
                ...state,
                hasTableEdited: action.hasTableEdited,
            };
        case ADD_FILTERED:
            return {
                ...state,
                filtered: action.filtered,
            };
        default:
            return state;
    }
};
