// @flow
import * as types from '../../constants/actionTypes';

export const setSearchState = (
    selectedLayer: number,
    textSearch: string,
    searchFieldValues: Array<Object>,
) => (dispatch: Function) => {
    dispatch({
        type: types.SET_SEARCH_STATE,
        selectedLayer,
        textSearch,
        searchFieldValues,
    });
};

export const setSearchOptions = (
    selectedLayer: number,
    layerList: Array<Object>,
) => (dispatch: Function) => {
    const foundIndex = layerList.findIndex(l => l.id === selectedLayer);
    dispatch({
        type: types.SET_SEARCH_OPTIONS,
        optionsField: layerList[foundIndex].fields,
    });
};
