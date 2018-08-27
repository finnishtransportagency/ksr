// @flow
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
} from '../../constants/actionTypes';
import {
    deSelectFeatures,
    mergeLayers,
    syncWithLayersList,
    toggleSelectAll,
    toggleSelection,
    updateLayerColumns,
} from '../../utils/parseFeatureData';

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
};

const initialState = {
    layers: [],
    editedLayers: [],
    activeTable: '',
    fetching: false,
    singleLayerGeometry: {},
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
        case SET_SINGLE_LAYER_GEOMETRY:
            return {
                ...state,
                singleLayerGeometry: action.geometry,
            };
        default:
            return state;
    }
};
