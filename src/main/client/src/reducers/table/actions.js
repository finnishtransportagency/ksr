// @flow
import { toast } from 'react-toastify';
import { fetchSearchQuery, queryFeatures } from '../../api/search/searchQuery';
import * as types from '../../constants/actionTypes';
import strings from '../../translations';
import { parseData } from '../../utils/parseFeatureData';
import save from '../../utils/saveFeatureData';
import { searchQueryMap } from '../../utils/workspace/loadWorkspace';
import { activateLayers, updateRelatedLayersData } from '../map/actions';
import { getSingleLayerFields } from '../../utils/map';
import { nestedVal } from '../../utils/nestedValue';
import { showConfirmModal } from '../confirmModal/actions';
import { updatePortal } from '../portal/actions';
import { closeTableIfNothingToShow } from '../utils';
import { setActiveAdminTool } from '../adminTool/actions';

export const toggleTable = (): { type: any, ... } => ({
    type: types.TOGGLE_TABLE,
});

export const toggleFilter = (): { type: any, ... } => ({
    type: types.TOGGLE_FILTER,
});

export const selectFeatures = (features: {}): { layers: any, type: any, ... } => ({
    type: types.SELECT_FEATURES,
    layers: parseData(features, true),
});

export const addShapeFeaturesToTable = (features: {}): { layers: any, type: any, ... } => ({
    type: types.SELECT_FEATURES,
    layers: parseData(features, false),
});

export const addUpdateLayers = (
    layerId: string,
    objectIdFieldName: string,
    objectId: number,
    selected?: boolean,
): ((dispatch: any) => void) => (dispatch: Function) => {
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

            const featureNotInLayer = !result.features.some(feature => nestedVal(
                feature,
                ['attributes', objectIdFieldName],
            ) === objectId);
            if (featureNotInLayer) {
                dispatch({
                    type: types.REMOVE_TABLE_FEATURE,
                    layerId,
                    objectId,
                    objectIdFieldName,
                });
            }
        });
};

export const setColumns = (columns: Array<Object>): { columns: Array<any>, type: any, ... } => ({
    type: types.SET_COLUMNS,
    columns,
});

export const searchFeatures = (queryMap: Map<Object, string>): ((dispatch: any) => void) => (dispatch: Function) => {
    const layersToBeAdded = {
        layers: [],
    };
    const searchQueries = [];

    dispatch({ type: types.SEARCH_FEATURES });
    let hasResults = false;

    queryMap.forEach((queryString, selectedLayer) => {
        const layerData = {
            layers: [],
        };
        dispatch({ type: types.CLEAR_SEARCH_DATA, layerId: `${selectedLayer.id}_s` });

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
                            originalQueryMap: queryMap,
                            definitionExpression: queryString,
                            visible: true,
                            active: true,
                            id: `${selectedLayer.id}_s`,
                            _source: 'search',
                            layerGroupName: strings.search.searchLayerGroupName,
                            title: fetchedLayer.title,
                            fields: fetchedLayer.fields,
                            features: fetchedLayer.features,
                            objectIdFieldName: fetchedLayer.objectIdFieldName,
                            renderer: null,
                            parentLayer: null,
                            minScale: 18489297,
                            uniqueSymbols: selectedLayer.uniqueSymbols
                                ? selectedLayer.uniqueSymbols.map(s => ({
                                    ...s,
                                    symbol: s.symbol.cloneNode(true),
                                }))
                                : undefined,
                        };

                        layersToBeAdded.layers.push(newLayer);
                        if (!hasResults) hasResults = true;
                    });
                }
            }));
    });

    Promise.all(searchQueries).then(async () => {
        if (!hasResults) toast.error(strings.search.notFound);
        await dispatch(activateLayers(layersToBeAdded.layers));

        dispatch({
            type: types.SEARCH_FEATURES_FULFILLED,
            layers: parseData(layersToBeAdded, false),
        });

        if (layersToBeAdded.layers.length) {
            dispatch({
                type: types.HIDE_LAYER,
                // Remove '_s' at the end of layer id.
                layerIds: layersToBeAdded.layers
                    .filter(newLayer => newLayer.type !== 'agfl')
                    .map(newLayer => newLayer.id.slice(0, -2)),
            });

            dispatch({
                type: types.ADD_SEARCH_RESULTS_LAYER,
                layers: layersToBeAdded.layers,
            });
        }

        dispatch(selectFeatures(layersToBeAdded));
    });
};

export const searchWorkspaceFeatures = (
    workspace: Object,
    layerList: Object[],
): ((dispatch: any) => void) => (dispatch: Function) => {
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
                                    ? `${selectedLayer.userLayerId}_s`
                                    : `${selectedLayer.layerId}_s`,
                                _source: 'search',
                                layerGroupName: strings.search.searchLayerGroupName,
                                title: fetchedLayer.title,
                                fields: fetchedLayer.fields,
                                features: fetchedLayer.features,
                                objectIdFieldName: fetchedLayer.objectIdFieldName,
                                renderer: null,
                                parentLayer: null,
                                minScale: 18489297,
                            };

                            layersToBeAdded.layers.push(newLayer);
                        });
                    } else {
                        dispatch({
                            type: types.CLEAR_SEARCH_DATA,
                            layerId: `${selectedLayer.layerId}_s`,
                        });
                    }
                })
                .catch(err => console.error(err)));
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

export const setActiveTable = (activeTable: string): { activeTable: string, type: any, ... } => ({
    type: types.SET_ACTIVE_TABLE,
    activeTable,
});

export const deSelectSelected = (): { type: any, ... } => ({
    type: types.DE_SELECT_SELECTED_FEATURES,
});

export const setRowFilter = (rows: Array<Object>): { rows: Array<any>, type: any, ... } => ({
    type: types.SET_ROW_FILTER,
    rows,
});

export const toggleSelection = (feature: Object): { feature: any, type: any, ... } => ({
    type: types.TOGGLE_SELECTION,
    feature,
});

export const toggleSelectAll = (layerId: string): { layerId: string, type: any, ... } => ({
    type: types.TOGGLE_SELECT_ALL,
    layerId,
});

export const clearTableData = (
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
    layerList: Object[],
    isAdminAgfl: boolean,
): ((dispatch: any) => void) => (dispatch: Function) => {
    let editedLayer: any = null;
    editedLayers.map(layer => layer.id === layer.id.replace('_s', '') && layer.data.some((d) => {
        if (d._edited && d._edited.length > 0) {
            editedLayer = layer;
        }
        return editedLayer;
    }));
    if (editedLayer && editedLayer.length !== 0) {
        dispatch(showConfirmModal(
            strings.modalClearTable.content,
            strings.modalClearTable.submit,
            strings.modalClearTable.cancel,
            () => {
                setTimeout(() => {
                    dispatch(showConfirmModal(
                        strings.modalSaveEditedData.content,
                        strings.modalSaveEditedData.submit,
                        strings.modalSaveEditedData.cancel,
                        () => {
                            save.saveEditedFeatureData(
                                view,
                                [editedLayer],
                                featureType,
                                addressField,
                                layerList,
                            )
                                .then(() => {
                                    dispatch({
                                        type: types.CLEAR_TABLE_DATA,
                                    });
                                    if (isAdminAgfl) {
                                        dispatch(setActiveAdminTool('', []));
                                    }
                                    view.popup.close();
                                });
                        },
                        () => {
                            dispatch({
                                type: types.CLEAR_TABLE_DATA,
                            });
                            if (isAdminAgfl) {
                                dispatch(setActiveAdminTool('', []));
                            }
                            view.popup.close();
                        },
                    ));
                }, 500);
            },
        ));
    } else {
        dispatch(showConfirmModal(
            strings.modalClearTable.content,
            strings.modalClearTable.submit,
            strings.modalClearTable.cancel,
            () => {
                dispatch({
                    type: types.CLEAR_TABLE_DATA,
                });
                if (isAdminAgfl) {
                    dispatch(setActiveAdminTool('', []));
                }
                view.popup.close();
            },
        ));
    }
};

export const setEditedLayer = (data: Array<Object>): { data: Array<any>, type: any, ... } => ({
    type: types.SET_EDITED_LAYER,
    data,
});

export const setSingleLayerGeometry = (geometry: Object): { geometry: any, type: any, ... } => ({
    type: types.SET_SINGLE_LAYER_GEOMETRY,
    geometry,
});

export const saveEditedFeatures = (
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
): ((dispatch: any, getState: any) => { type: string, ... }) => (dispatch: Function, getState: Function) => {
    const { layerList } = dispatch(getState).map.layerGroups;
    save.saveEditedFeatureData(view, editedLayers, featureType, addressField, layerList)
        .then((resEdits) => {
            const edits = resEdits.filter(e => e !== null);
            dispatch({
                type: types.APPLY_EDITS,
                edits,
            });

            const editedLayerId = nestedVal(edits, ['0', 'layerId']);

            const foundLayer = layerList.find(layer => layer.id === editedLayerId);
            const foundSearchLayer = layerList.find(layer => layer.id === `${editedLayerId}_s`);

            if (foundSearchLayer) {
                const queryMap = new Map([
                    [foundLayer, foundSearchLayer.definitionExpression],
                ]);

                dispatch(searchFeatures(queryMap));
            }

            // Refresh all childLayer search layers.
            if (layerList.some(ll => ll.parentLayer === foundLayer.id)) {
                layerList.filter(childLayer => childLayer.parentLayer === foundLayer.id)
                    .forEach((childLayer) => {
                        const foundChildSearchLayer = layerList.find(layer => layer.id === `${childLayer.id}_s`);

                        if (foundChildSearchLayer) {
                            const queryMap = new Map([
                                [childLayer, foundChildSearchLayer.definitionExpression],
                            ]);

                            dispatch(searchFeatures(queryMap));
                        }
                    });
            }

            const layersToUpdate = editedLayers.map(l => layerList.find(la => la.id === l.id));
            dispatch(updateRelatedLayersData(layersToUpdate));
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
): ((dispatch: any, getState: any) => void) => (dispatch: Function, getState: Function) => {
    view.popup.close();
    const { layerList } = dispatch(getState).map.layerGroups;
    save.saveDeletedFeatureData(view, layerId, objectIds, deleteComment)
        .then(() => {
            dispatch({
                type: types.APPLY_DELETED_FEATURES,
                objectIds,
                layerId,
                layerList,
            });
        });
};

export const closeTableTab = (
    layerId: string,
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
    isAgfl: boolean,
): ((dispatch: any) => void) => (dispatch: Function) => {
    const editedLayer = editedLayers.find(e => e.id === layerId);
    const containsEdit = editedLayer && editedLayer.data
        .some(d => d._edited.length > 0);
    if (containsEdit) {
        dispatch(showConfirmModal(
            strings.modalClearTableTab.content,
            strings.modalClearTableTab.submit,
            strings.modalClearTableTab.cancel,
            () => {
                setTimeout(() => {
                    dispatch(showConfirmModal(
                        strings.modalSaveEditedData.content,
                        strings.modalSaveEditedData.submit,
                        strings.modalSaveEditedData.cancel,
                        () => {
                            dispatch(saveEditedFeatures(
                                view,
                                [editedLayer],
                                featureType,
                                addressField,
                            ));
                            if (isAgfl) {
                                dispatch(setActiveAdminTool('', []));
                            }
                        },
                        () => {
                            dispatch({
                                type: types.CLOSE_LAYER,
                                layerId,
                            });
                            closeTableIfNothingToShow();
                            if (isAgfl) {
                                dispatch(setActiveAdminTool('', []));
                            }
                            view.popup.close();
                            dispatch(updatePortal());
                        },
                    ));
                }, 500);
            },
        ));
    } else {
        dispatch(showConfirmModal(
            strings.modalClearTableTab.content,
            strings.modalClearTableTab.submit,
            strings.modalClearTableTab.cancel,
            () => {
                dispatch({
                    type: types.CLOSE_LAYER,
                    layerId,
                });
                if (isAgfl) {
                    dispatch(setActiveAdminTool('', []));
                }
                closeTableIfNothingToShow();
                view.popup.close();
                dispatch(updatePortal());
            },
        ));
    }
};

export const addNonSpatialContentToTable = (
    layer: Object,
    workspaceFeatures?: Object[],
    clear?: boolean,
    selectedFeatures?: Object[],
): ((dispatch: any) => Promise<void>) => async (dispatch: Function) => {
    dispatch({
        type: types.SET_LOADING_LAYERS,
        layerIds: [layer.id],
    });
    await fetchSearchQuery(layer.id, '1=1', layer.name, { layers: [] })
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
                clear,
            });
            dispatch({
                type: types.REMOVE_LOADING_LAYERS,
                layerIds: [layer.id],
            });
            if (selectedFeatures) {
                selectedFeatures.forEach(f => dispatch(toggleSelection(f)));
            }
        })
        .catch(err => console.error(err));
};

export const setSearchFeatures = (layers: Array<Object>): { layers: any, type: any, ... } => ({
    type: types.SEARCH_FEATURES_FULFILLED,
    layers: parseData({ layers }, false),
});

export const setButtonAmount = (buttonAmount: ?number): { buttonAmount: ?number, type: any, ... } => ({
    type: types.SET_BUTTON_AMOUNT,
    buttonAmount,
});

export const setActivePage = (page: Object): { page: any, type: any, ... } => ({
    type: types.SET_ACTIVE_PAGE,
    page,
});

export const setTableEdited = (hasTableEdited: boolean): { hasTableEdited: boolean, type: any, ... } => ({
    type: types.TABLE_EDITED,
    hasTableEdited,
});

export const addFiltered = (filtered: Array<Object>): { filtered: Array<any>, type: any, ... } => ({
    type: types.ADD_FILTERED,
    filtered,
});

export const sketchSaveData = (
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
    hasTableEdited: boolean,
): ((dispatch: any) => void) => (dispatch: Function) => {
    if (hasTableEdited) {
        dispatch(showConfirmModal(
            strings.modalSaveEditedData.content,
            strings.modalSaveEditedData.submit,
            strings.modalSaveEditedData.cancel,
            () => {
                dispatch(saveEditedFeatures(
                    view,
                    editedLayers,
                    featureType,
                    addressField,
                ));
                dispatch(deSelectSelected());
                closeTableIfNothingToShow();
            },
            () => {
                dispatch(deSelectSelected());
                closeTableIfNothingToShow();
            },
        ));
    } else {
        dispatch(deSelectSelected());
        closeTableIfNothingToShow();
    }
};

export const addFeatureNoGeometry = (featureNoGeometry: Object): ((dispatch: any) => void) => (dispatch: Function) => {
    dispatch({
        type: types.ADD_FEATURE_NO_GEOMETRY,
        featureNoGeometry,
    });
};
