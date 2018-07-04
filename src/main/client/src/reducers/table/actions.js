// @flow
import { fetchSearchQuery } from '../../api/search/searchQuery';
import * as types from '../../constants/actionTypes';
import { parseData, parseColumns } from '../../utils/parseFeatureData';

export const toggleTable = () => ({
    type: types.TOGGLE_TABLE,
});

export const toggleFilter = () => ({
    type: types.TOGGLE_FILTER,
});

export const selectFeatures = (features: {}) => ({
    type: types.SELECT_FEATURES,
    layers: parseData(features, true, 'select'),
});

export const setColumns = (columns: Array<Object>) => ({
    type: types.SET_COLUMNS,
    columns,
});
export const searchFeatures = (
    selectedLayer: number,
    queryString: string,
    title: string,
) => (dispatch: Function) => {
    const layerData = {
        layers: [],
    };

    dispatch({ type: types.SEARCH_FEATURES });
    fetchSearchQuery(selectedLayer, queryString, title, layerData)
        .then((r) => {
            dispatch({
                type: types.SEARCH_FEATURES_FULFILLED,
                layers: parseData(r, false, 'search'),
            });
        });
};

export const setFeatureData = (columnData: Array<Object>) => (dispatch: Function) => {
    dispatch({
        type: types.SET_FEATURES, payload: parseColumns(columnData),
    });
};

export const setActiveTable = (activeTable: string) => ({
    type: types.SET_ACTIVE_TABLE,
    activeTable,
});

export const deSelectSelected = () => ({
    type: types.DE_SELECT_SELECTED_FEATURES,
});
