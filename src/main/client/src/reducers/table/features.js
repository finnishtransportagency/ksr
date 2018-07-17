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
    activeTable: string,
};

type Action = {
    type: string,
    layers: Array<Object>,
    columns: Array<Object>,
    activeTable: string,
    layerList: Array<Object>,
    layerId: string,
    feature: Object,
};

const initialState = {
    layers: [],
    activeTable: '',
    fetching: false,
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
            };
        case TOGGLE_SELECT_ALL:
            return {
                ...state,
                layers: toggleSelectAll(state.layers, action.layerId),
            };
        case CLEAR_TABLE_DATA:
            return initialState;
        default:
            return state;
    }
};
