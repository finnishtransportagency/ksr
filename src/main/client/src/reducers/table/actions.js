// @flow
import { toast } from 'react-toastify';
import { fetchSearchQuery } from '../../api/search/searchQuery';
import * as types from '../../constants/actionTypes';
import strings from '../../translations';
import { parseData } from '../../utils/parseFeatureData';
import save from '../../utils/saveFeatureData';
import { searchQueryMap } from '../../utils/workspace/loadWorkspace';

export const toggleTable = () => ({
    type: types.TOGGLE_TABLE,
});

export const toggleFilter = () => ({
    type: types.TOGGLE_FILTER,
});

export const selectFeatures = (features: {}) => ({
    type: types.SELECT_FEATURES,
    layers: parseData(features, true),
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
        dispatch({ type: types.CLEAR_SEARCH_DATA, layerId: `${selectedLayer.id}.s` });

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
            layers: parseData(layersToBeAdded, false),
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

export const searchWorkspaceFeatures = (
    workspace: Object,
    layerList: Object[],
) => (dispatch: Function) => {
    const layersToBeAdded = {
        layers: [],
    };
    const searchQueries = [];

    const queryMap = searchQueryMap(workspace, layerList);

    dispatch({ type: types.SEARCH_FEATURES });

    queryMap.forEach((queryString, selectedLayer) => {
        const layerData = {
            layers: [],
        };
        if (selectedLayer.layer) {
            searchQueries.push(fetchSearchQuery(
                selectedLayer.layerId,
                queryString,
                selectedLayer.layer.name,
                layerData,
            )
                .then((r) => {
                    if (r.layers.length) {
                        r.layers.forEach((fetchedLayer) => {
                            fetchedLayer.features.map((f) => {
                                const selectedObj = selectedLayer.selectedFeaturesList.find(obj =>
                                    parseInt(obj.id, 10) ===
                                    f.attributes[fetchedLayer.objectIdFieldName]);
                                if (selectedObj) {
                                    f.selected = selectedObj.highlight;
                                }
                                return f;
                            });

                            const newLayer = {
                                ...selectedLayer.layer,
                                name: selectedLayer.layer.name,
                                definitionExpression: queryString,
                                visible: true,
                                active: true,
                                opacity: selectedLayer.opacity,
                                id: `${selectedLayer.layerId}.s`,
                                _source: 'search',
                                title: fetchedLayer.title,
                                fields: fetchedLayer.fields,
                                features: fetchedLayer.features,
                                objectIdFieldName: fetchedLayer.objectIdFieldName,
                            };

                            layersToBeAdded.layers.push(newLayer);
                        });
                    }
                })
                .catch(err => console.log(err)));
        }
    });

    Promise.all(searchQueries).then(() => {
        dispatch({
            type: types.SEARCH_FEATURES_FULFILLED,
            layers: parseData(layersToBeAdded, false),
        });

        if (layersToBeAdded.layers.length) {
            dispatch({
                type: types.ADD_SEARCH_RESULTS_LAYER,
                layers: layersToBeAdded.layers,
            });
        }

        dispatch({
            type: types.SET_WORKSPACE_FULFILLED,
            workspace,
        });

        toast.update('loadingWorkspace', {
            render: `${strings.workspace.workspaceLoaded} [${workspace.name}]`,
            type: toast.TYPE.SUCCESS,
            autoClose: 5000,
        });
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

export const saveEditedFeatures = (
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
) => (dispatch: Function) => {
    save.saveEditedFeatureData(view, editedLayers, featureType, addressField)
        .then((edits) => {
            dispatch({
                type: types.APPLY_EDITS,
                edits,
            });
        });

    return {
        type: 'none',
    };
};

export const saveDeletedFeatures = (
    view: Object,
    layerId: string,
    objectIds: string,
    deleteComment: string,
) => (dispatch: Function) => {
    view.popup.close();
    save.saveDeletedFeatureData(view, layerId, objectIds, deleteComment)
        .then(() => {
            dispatch({
                type: types.APPLY_DELETED_FEATURES,
                objectIds,
                layerId,
            });
        });
};

export const addNonSpatialContentToTable = (layer: Object) => (dispatch: Function) => {
    fetchSearchQuery(layer.id, '1=1', layer.name, { layers: [] })
        .then((r) => {
            const layers = parseData(r, false).map((l) => {
                if (l.id === layer.id) {
                    return {
                        ...l,
                        type: layer.type,
                    };
                }
                return { ...l };
            });

            dispatch({
                type: types.SELECT_FEATURES,
                layers,
            });
        })
        .catch(err => console.error(err));
};
