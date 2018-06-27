// @flow
import {
    SET_SEARCH_STATE,
    SET_SEARCH_OPTIONS,
    SEARCH_FEATURES,
    SEARCH_FEATURES_FULFILLED,
    SET_LAYER_LIST,
} from '../../constants/actionTypes';

type State = {
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
    optionsField: Array<Object>,
    optionsExpression: Array<Object>,
    fetching: boolean,
};

type Action = {
    type: string,
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
    optionsField: Array<Object>,
    layerId: number,
    queryableLayers: Array<Object>,
};

const initialState = {
    selectedLayer: 0,
    textSearch: '',
    searchFieldValues: [],
    optionsField: [],
    optionsExpression: [
        {
            value: '%',
            label: '%',
        },
        {
            value: '<=',
            label: '<=',
        },
        {
            value: '>=',
            label: '>=',
        },
        {
            value: '=',
            label: '=',
        },
        {
            value: '!=',
            label: '!=',
        },
    ],
    fetching: false,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SEARCH_FEATURES:
            return {
                ...state,
                fetching: true,
            };
        case SEARCH_FEATURES_FULFILLED:
            return {
                ...state,
                fetching: false,
            };
        case SET_SEARCH_STATE:
            return {
                ...state,
                selectedLayer: action.selectedLayer,
                textSearch: action.textSearch,
                searchFieldValues: action.searchFieldValues,
            };
        case SET_SEARCH_OPTIONS:
            return {
                ...state,
                optionsField: action.optionsField,
            };
        case SET_LAYER_LIST:
            // Reset searchState if selected layers visibility or activity has been changed
            if (action.queryableLayers.filter(ql =>
                ql.value === state.selectedLayer).length === 0) {
                return initialState;
            }
            return state;
        default:
            return state;
    }
};
