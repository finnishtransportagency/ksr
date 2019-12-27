// @flow
import { toast } from 'react-toastify';
import { fetchSearchQuery, queryFeatures } from '../../api/search/searchQuery';
import * as types from '../../constants/actionTypes';
import strings from '../../translations';
import { parseData } from '../../utils/parseFeatureData';
import save from '../../utils/saveFeatureData';
import { searchQueryMap } from '../../utils/workspace/loadWorkspace';
import { activateLayers } from '../map/actions';
import { getSingleLayerFields } from '../../utils/map';
import { nestedVal } from '../../utils/nestedValue';

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

export const addUpdateLayers = (
    layerId: string,
    objectIdFieldName: string,
    objectId: number,
    selected?: boolean,
) => (dispatch: Function) => {
    queryFeatures(
        parseInt(layerId, 10),
        `${objectIdFieldName} = ${objectId}`,
        null,
    )
        .then((result) => {
            if (result && result.fields && result.features.length > 0) {
                // Add layer Id to result
                result.id = layerId;
                dispatch({
                    type: types.SELECT_FEATURES,
                    layers: parseData({ layers: [result] }, selected),
                });
            }
        });
};

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
                if (r && r.layers.length) {
                    r.layers.forEach((fetchedLayer) => {
                        const newLayer = {
                            ...selectedLayer,
                            name: selectedLayer.name,
                            definitionExpression: queryString,
                            visible: true,
                            active: true,
                            id: `${selectedLayer.id}.s`,
                            _source: 'search',
                            layerGroupName: strings.search.searchLayerGroupName,
                            title: fetchedLayer.title,
                            fields: fetchedLayer.fields,
                            features: fetchedLayer.features,
                            objectIdFieldName: fetchedLayer.objectIdFieldName,
                            renderer: null,
                            parentLayer: null,
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

        dispatch(activateLayers(layersToBeAdded.layers));

        if (layersToBeAdded.layers.length) {
            dispatch({
                type: types.HIDE_LAYER,
                // Remove '.s' at the end of layer id.
                layerIds: layersToBeAdded.layers
                    .filter(newLayer => newLayer.type !== 'agfl')
                    .map(newLayer => newLayer.id.slice(0, -2)),
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
                selectedLayer.userLayerId ? selectedLayer.userLayerId : selectedLayer.layerId,
                queryString,
                selectedLayer.layer.name,
                layerData,
            )
                .then((r) => {
                    if (r && r.layers.length) {
                        r.layers.forEach((fetchedLayer) => {
                            fetchedLayer.features.map((f) => {
                                const selectedObj = selectedLayer.selectedFeaturesList.find(obj => (
                                    parseInt(obj.id, 10) === f
                                        .attributes[fetchedLayer.objectIdFieldName]));
                                if (selectedObj) {
                                    f.selected = selectedObj.highlight;
                                }
                                return f;
                            });

                            const newLayer = {
                                ...selectedLayer.layer,
                                name: selectedLayer.layer.name,
                                definitionExpression: queryString,
                                visible: selectedLayer.visible,
                                active: true,
                                opacity: selectedLayer.opacity,
                                id: selectedLayer.userLayerId
                                    ? `${selectedLayer.userLayerId}.s`
                                    : `${selectedLayer.layerId}.s`,
                                _source: 'search',
                                layerGroupName: strings.search.searchLayerGroupName,
                                title: fetchedLayer.title,
                                fields: fetchedLayer.fields,
                                features: fetchedLayer.features,
                                objectIdFieldName: fetchedLayer.objectIdFieldName,
                                renderer: null,
                                parentLayer: null,
                            };

                            layersToBeAdded.layers.push(newLayer);
                        });
                    } else {
                        dispatch({
                            type: types.CLEAR_SEARCH_DATA,
                            layerId: `${selectedLayer.layerId}.s`,
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
            const addSearchResultLayers = layersToBeAdded.layers.map(l => ({
                ...l,
                features: l.features.map(f => ({
                    ...f,
                    selected: undefined,
                })),
            }));

            dispatch({
                type: types.ADD_SEARCH_RESULTS_LAYER,
                layers: addSearchResultLayers,
            });

            dispatch({
                type: types.REMOVE_LOADING_LAYERS,
                layerIds: layersToBeAdded.layers.map(layer => layer.id),
            });
        }

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

export const setRowFilter = (rows: Object[]) => ({
    type: types.SET_ROW_FILTER,
    rows,
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

export const closeTableTab = (layerId: string) => ({
    type: types.CLOSE_LAYER,
    layerId,
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
) => (dispatch: Function, getState: Function) => {
    save.saveEditedFeatureData(view, editedLayers, featureType, addressField)
        .then((edits) => {
            dispatch({
                type: types.APPLY_EDITS,
                edits,
            });

            const editedLayerId = nestedVal(edits, ['0', 'layerId']);

            const { layerList } = dispatch(getState).map.layerGroups;
            const foundLayer = layerList.find(layer => layer.id === editedLayerId);
            const foundSearchLayer = layerList.find(layer => layer.id === `${editedLayerId}.s`);

            if (foundSearchLayer) {
                const queryMap = new Map([
                    [foundLayer, foundSearchLayer.definitionExpression],
                ]);

                dispatch(searchFeatures(queryMap));
            }
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

export const addNonSpatialContentToTable = (
    layer: Object,
    workspaceFeatures?: Object[],
) => (dispatch: Function) => {
    fetchSearchQuery(layer.id, '1=1', layer.name, { layers: [] })
        .then(async (results) => {
            if (workspaceFeatures) {
                results.layers.forEach((l) => {
                    l.features.forEach((f) => {
                        const selectedObj = workspaceFeatures && workspaceFeatures.find(obj => (
                            obj.featureId === f.attributes[l.objectIdFieldName]));
                        if (selectedObj) {
                            f.selected = selectedObj.selected;
                        }
                        return f;
                    });
                });
            }
            const layers = parseData(results, false).map((l) => {
                if (l.id === layer.id) {
                    return {
                        ...l,
                        type: layer.type,
                    };
                }
                return { ...l };
            });

            const layerToUpdate = await getSingleLayerFields({ ...layer });

            dispatch({
                type: types.UPDATE_LAYER,
                layer: {
                    ...layerToUpdate,
                    active: true,
                    visible: true,
                },
            });

            dispatch({
                type: types.SELECT_FEATURES,
                layers,
            });
        })
        .catch(err => console.error(err));
};

export const setSearchFeatures = (layers: Object[]) => ({
    type: types.SEARCH_FEATURES_FULFILLED,
    layers: parseData({ layers }, false),
});
