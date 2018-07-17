// @flow
import { fetchSearchQuery } from '../../api/search/searchQuery';
import * as types from '../../constants/actionTypes';
import { parseData } from '../../utils/parseFeatureData';

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
    selectedLayer: Object,
    queryString: string,
) => (dispatch: Function) => {
    const layerData = {
        layers: [],
    };

    dispatch({ type: types.SEARCH_FEATURES });
    fetchSearchQuery(selectedLayer.id, queryString, selectedLayer.name, layerData)
        .then((r) => {
            const newLayer = {
                ...selectedLayer,
                name: selectedLayer.name,
                definitionExpression: queryString,
                visible: true,
                id: `${selectedLayer.id}.s`,
                _source: 'search',
            };

            const res = {
                layers: r.layers.map(l => ({
                    ...l,
                    id: newLayer.id,
                    title: newLayer.name,
                })),
            };

            dispatch({
                type: types.SEARCH_FEATURES_FULFILLED,
                layers: parseData(res, false, 'search'),
            });

            if (res.layers.length) {
                dispatch({
                    type: types.HIDE_LAYER,
                    layerId: selectedLayer.id,
                });

                dispatch({
                    type: types.ADD_SEARCH_RESULTS_LAYER,
                    layer: newLayer,
                });
            }
        });
};

export const setActiveTable = (activeTable: string) => ({
    type: types.SET_ACTIVE_TABLE,
    activeTable,
});

export const deSelectSelected = () => ({
    type: types.DE_SELECT_SELECTED_FEATURES,
});

export const toggleSelection = (feature: Object) => ({
    type: types.TOGGLE_SELECTION,
    feature,
});

export const toggleSelectAll = (layerId: string) => ({
    type: types.TOGGLE_SELECT_ALL,
    layerId,
});

export const clearTableData = () => ({
    type: types.CLEAR_TABLE_DATA,
});
