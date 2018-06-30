// @flow
import { fetchSearchQuery } from '../../api/search/searchQuery';
import * as types from '../../constants/actionTypes';
import { parseData, parseFeatureColumns, parseColumns } from '../../utils/parseFeatureData';

export const toggleTable = () => ({
    type: types.TOGGLE_TABLE,
});

export const toggleFilter = () => ({
    type: types.TOGGLE_FILTER,
});

export const selectFeatures = (features: {}) => {
    const data = parseData(features, true, 'select');
    const columns = parseFeatureColumns(features);
    return {
        type: types.SELECT_FEATURES,
        data,
        columns,
        features,
    };
};

export const searchFeatures = (
    selectedLayer: number,
    queryString: string,
) => (dispatch: Function) => {
    const layerData = {
        layers: [],
    };

    dispatch({ type: types.SEARCH_FEATURES });
    fetchSearchQuery(selectedLayer, queryString, layerData)
        .then((r) => {
            const data = parseData(r, false, 'search');
            const columns = parseFeatureColumns(r);
            dispatch({
                type: types.SEARCH_FEATURES_FULFILLED,
                data,
                columns,
                r,
            });
        });
};

export const setFeatureData = (columnData: Array<Object>) => (dispatch: Function) => {
    dispatch({
        type: types.SET_FEATURES, payload: parseColumns(columnData),
    });
};

