// @flow
import { GET_FEATURES, GET_FEATURES_FULFILLED, SELECT_FEATURES } from '../../constants/actionTypes';
import { mergeColumns, mergeData } from '../../utils/parseFeatureData';

type State = {
    features: Object,
    fetching: boolean,
    data: Map<string, {}>,
    columns: Map<string, {}>,
    dataFromSelect: Set<string>,
    columnsFromSelect: Set<string>,
};

type Action = {
    type: string,
    payload: Object,
    data: Map<string, {}>,
    columns: Map<string, {}>,
};

const initialState = {
    features: {},
    fetching: false,
    data: new Map(),
    columns: new Map(),
    dataFromSelect: new Set(),
    columnsFromSelect: new Set(),
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case GET_FEATURES:
            return {
                ...state,
                fetching: true,
            };
        case GET_FEATURES_FULFILLED:
            return {
                ...state,
                features: action.payload,
                data: action.data,
                columns: action.columns,
                fetching: false,
            };
        case SELECT_FEATURES:
            return {
                ...state,
                ...mergeColumns(state.columns, action.columns, state.columnsFromSelect),
                ...mergeData(state.data, action.data, state.dataFromSelect),
            };
        default:
            return state;
    }
};
