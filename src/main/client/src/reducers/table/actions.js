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
export const searchFeatures = (selectedLayer: Object, queryString: string) => 
    (dispatch: Function) => {
        const layerData = {
            layers: [],
        };

        dispatch({ type: types.SEARCH_FEATURES });
        fetchSearchQuery(selectedLayer.id, queryString, selectedLayer.name, layerData)
            .then((r) => {
                // @TODO: Create a new maplayer from this results
                dispatch({
                    type: types.SEARCH_FEATURES_FULFILLED,
                    layers: parseData(r, false, 'search'),
                });
                dispatch({
                    type: types.HIDE_LAYER,
                    layerId: selectedLayer.id,
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

export const toggleSelection = feature => ({
    type: types.TOGGLE_SELECTION,
    feature,
});

export const toggleSelectAll = layerId => ({
    type: types.TOGGLE_SELECT_ALL,
    layerId,
});
