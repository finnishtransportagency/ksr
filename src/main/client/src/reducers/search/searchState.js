// @flow
import {
    SET_SEARCH_STATE,
    SET_SEARCH_OPTIONS,
    SEARCH_FEATURES,
    SEARCH_FEATURES_FULFILLED,
} from '../../constants/actionTypes';

type State = {
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
    optionsField: Array<Object>,
    optionsExpression: Array<Object>,
    fetching: boolean,
    suggestions: Array<string>,
};

type Action = {
    type: string,
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
    optionsField: Array<Object>,
    layerId: number,
    suggestions: Array<string>,
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
    suggestions: [],
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
                suggestions: action.suggestions,
            };
        case SET_SEARCH_OPTIONS:
            return {
                ...state,
                optionsField: action.optionsField,
            };
        default:
            return state;
    }
};
