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

export const searchFeatures = (queryMap: Map<Object, string>) => (dispatch: Function) => {
    const layersToBeAdded = {
        layers: [],
    };

    const searchQueries = [];
    dispatch({ type: types.SEARCH_FEATURES });
    queryMap.forEach((queryString, selectedLayer) => {
        const layerData = {
            layers: [],
        };
        searchQueries.push(fetchSearchQuery(
            selectedLayer.id,
            queryString,
            selectedLayer.name,
            layerData,
        )
            .then((r) => {
                if (r.layers.length) {
                    r.layers.forEach((fetchedLayer) => {
                        const newLayer = {
                            ...selectedLayer,
                            name: selectedLayer.name,
                            definitionExpression: queryString,
                            visible: true,
                            active: true,
                            id: `${selectedLayer.id}.s`,
                            _source: 'search',
                            title: fetchedLayer.title,
                            fields: fetchedLayer.fields,
                            features: fetchedLayer.features,
                            objectIdFieldName: fetchedLayer.objectIdFieldName,
                        };

                        layersToBeAdded.layers.push(newLayer);
                    });
                }
            }));
    });

    Promise.all(searchQueries).then(() => {
        dispatch({
            type: types.SEARCH_FEATURES_FULFILLED,
            layers: parseData(layersToBeAdded, false, 'search'),
        });

        if (layersToBeAdded.layers.length) {
            dispatch({
                type: types.HIDE_LAYER,
                // Remove '.s' at the end of layer id.
                layerIds: layersToBeAdded.layers.map(newLayer => newLayer.id.slice(0, -2)),
            });

            dispatch({
                type: types.ADD_SEARCH_RESULTS_LAYER,
                layers: layersToBeAdded.layers,
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

export const setEditedLayer = (data: Array<Object>) => ({
    type: types.SET_EDITED_LAYER,
    data,
});

export const setSingleLayerGeometry = (geometry: Object) => ({
    type: types.SET_SINGLE_LAYER_GEOMETRY,
    geometry,
});
