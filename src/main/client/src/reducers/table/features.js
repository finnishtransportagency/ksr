// @flow
import {
    SELECT_FEATURES,
    SET_ACTIVE_TABLE,
    SET_COLUMNS,
    SET_LAYER_LIST,
    DE_SELECT_SELECTED_FEATURES,
    SEARCH_FEATURES_FULFILLED,
    TOGGLE_SELECTION,
    TOGGLE_SELECT_ALL,
    CLEAR_TABLE_DATA,
    SET_ACTIVE_ADMIN_TOOL,
    SET_EDITED_LAYER,
} from '../../constants/actionTypes';
import {
    mergeLayers,
    updateLayerColumns,
    syncWithLayersList,
    deSelectFeatures,
    toggleSelection,
    toggleSelectAll,
} from '../../utils/parseFeatureData';

type State = {
    fetching: boolean,
    layers: Array<Object>,
    editedLayers: Array<Object>,
    activeTable: string,
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
};

const initialState = {
    layers: [],
    editedLayers: [],
    activeTable: '',
    fetching: false,
};

export default (state: State = initialState, action: Action) => {
    const editedLayers = JSON.parse(JSON.stringify(state.editedLayers));
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
            return initialState;
        case CLEAR_TABLE_DATA:
            return initialState;
        case SET_EDITED_LAYER:
            if (editedLayers) editedLayers.find(l => l.id === state.activeTable).data = action.data;
            return {
                ...state,
                editedLayers,
            };
        default:
            return state;
    }
};
