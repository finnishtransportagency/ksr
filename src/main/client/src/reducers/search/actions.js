// @flow
import * as types from '../../constants/actionTypes';

export const setSearchState = (
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
    suggestions: Array<string>,
    suggestionsActive: boolean,
) => ({
    type: types.SET_SEARCH_STATE,
    selectedLayer,
    textSearch,
    searchFieldValues,
    suggestions,
    suggestionsActive,
});

export const setSearchOptions = (
    selectedLayer: number,
    layerList: any,
) => ({
    type: types.SET_SEARCH_OPTIONS,
    optionsField: layerList.find(l => l.id === selectedLayer).fields,
});
