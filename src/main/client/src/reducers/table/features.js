// @flow
import {
    SELECT_FEATURES,
    SET_ACTIVE_TABLE,
    SET_COLUMNS,
} from '../../constants/actionTypes';
import { mergeLayers, updateLayerColumns } from '../../utils/parseFeatureData';

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
        default:
            return state;
    }
};
