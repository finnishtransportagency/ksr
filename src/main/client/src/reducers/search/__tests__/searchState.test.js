import * as types from '../../../constants/actionTypes';
import { searchFeatures } from '../../table/actions';
import { setSearchState } from '../actions';
import reducer from '../searchState';

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

describe('Search state reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle SEARCH_FEATURES', () => {
        expect(reducer(undefined, {
            type: types.SEARCH_FEATURES,
        })).toEqual({ ...initialState, fetching: true });
    });

    it('should handle SEARCH_FEATURES_FULFILLED', () => {
        expect(reducer(undefined, {
            type: types.SEARCH_FEATURES_FULFILLED,
        })).toEqual({ ...initialState, fetching: false });
    });

    it('should handle SET_LAYER_LIST', () => {
        expect(reducer(undefined, {
            type: types.SET_LAYER_LIST,
            queryableLayers: [],
        })).toEqual({ ...initialState });
    });

    it('should handle SET_SEARCH_STATE', () => {
        const action = {
            selectedLayer: 1,
            textSearch: '',
            searchFieldValues: [
                {
                    id: 1,
                    name: 'name',
                    queryExpression: '=',
                    queryText: 'helsinki',
                },
            ],
            suggestions: ['Helsinki'],
        };

        expect(reducer(undefined, {
            type: types.SET_SEARCH_STATE,
            selectedLayer: action.selectedLayer,
            textSearch: action.textSearch,
            searchFieldValues: action.searchFieldValues,
            suggestions: action.suggestions,
        })).toEqual({
            ...initialState,
            selectedLayer: action.selectedLayer,
            textSearch: action.textSearch,
            searchFieldValues: action.searchFieldValues,
            suggestions: action.suggestions,
        });
    });

    it('should handle SET_SEARCH_OPTIONS', () => {
        const action = {
            optionsField: [
                {
                    value: 1,
                    name: 'field 1',
                },
            ],
        };

        expect(reducer(undefined, {
            type: types.SET_SEARCH_OPTIONS,
            optionsField: action.optionsField,
        })).toEqual({ ...initialState, optionsField: action.optionsField });
    });
});
