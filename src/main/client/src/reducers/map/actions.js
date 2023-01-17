// @flow
import { toast } from 'react-toastify';
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { layerData } from '../../api/map/layerData';
import { fetchAddUserLayer } from '../../api/user-layer/addUserLayer';
import { deleteUserLayer } from '../../api/user-layer/deleteUserLayer';
import * as types from '../../constants/actionTypes';
import { addLayers, getSingleLayerFields } from '../../utils/map';
import { reorderChildLayers, reorderLayers } from '../../utils/reorder';
import { addNonSpatialContentToTable, searchFeatures, selectFeatures } from '../table/actions';
import { setLayerLegend } from '../../utils/layerLegend';
import { setWorkspaceFeatures } from '../workspace/actions';
import strings from '../../translations';
import { nestedVal } from '../../utils/nestedValue';
import { closeTableIfNothingToShow, shouldToggleLayerLegend } from '../utils';
import store from '../../store';
import { getSiblingsOrSelf, relatedLayers as getRelatedLayers } from '../../utils/layers';
import { fetchSearchQuery } from '../../api/search/searchQuery';

export const setLayerList = (layerList: Array<any>) => ({
    type: types.SET_LAYER_LIST,
    layerList: reorderChildLayers(layerList),
});

export const updateLayer = (layer: Object) => ({
    type: types.UPDATE_LAYER,
    layer,
});

export const updateLayerFields = (layerId: string, fields: Object[]) => ({
    type: types.UPDATE_LAYER_FIELDS,
    layerId,
    fields,
});

export const getLayerGroups = () => async (dispatch: Function) => {
    dispatch({ type: types.GET_LAYER_GROUPS });

    const layerGroups = await fetchLayerGroups();
    const layerList = layerGroups
        .flatMap(lg => lg.layers.map(layer => ({
            ...layer,
            layerGroupName: lg.name,
            originalLayerOrder: layer.layerOrder,
        })))
        .sort((a, b) => b.layerOrder - a.layerOrder);

    // Update layers fields
    layerList.forEach((layer) => {
        if (!layer.fields) {
            getSingleLayerFields(layer).then(
                (fetchedLayer) => {
                    updateLayerFields(fetchedLayer.id, fetchedLayer.fields);
                },
            ).catch(err => console.error(err));
        }
    });

    return dispatch({
        type: types.GET_LAYER_GROUPS_FULFILLED,
        layerGroups: layerGroups.map(lg => ({
            ...lg,
            layers: lg.layers.map(layer => layer),
        })),
        layerList,
    });
};

/**
 * Handles activating new layers. Works with single layer, layer group or workspace.
 *
 * Sets loading to all layers that are being activated. If layer added successfully to map view
 * it will be updated into layer list. If a layer fails it will not be added to layer list and
 * toast will be shown for the failing layer.
 *
 * If called from workspace load, will also handle zooming to saved extent and updating workspace
 * load toast after everything has been successfully loaded from the workspace.
 *
 * @param {Object[]} layers Layers to be activated.
 * @param {Object} [workspace] Workspace to be loaded.
 */
export const activateLayers = (
    layers: Object[],
    workspace?: Object,
) => async (dispatch: Function, getState: Function) => {
    const { view } = dispatch(getState).map.mapView;
    const { activeAdminTool } = dispatch(getState).adminTool.active.layerId;
    const { layerList } = dispatch(getState).map.layerGroups;

    view.popup.close();

    // Add related child/parent -layers if either is included in layers to be activated.
    let layersToBeActivated = layers.concat(layerList
        .filter(ll => layers.some(l => ll.id === l.parentLayer)));
    layersToBeActivated = layersToBeActivated.concat(layerList
        .filter(ll => layersToBeActivated.some(l => ll.parentLayer === l.id)));

    dispatch({
        type: types.SET_LOADING_LAYERS,
        layerIds: layersToBeActivated.map(l => l.id),
    });

    let { failedLayers } = await addLayers(
        layersToBeActivated,
        view,
        workspace !== undefined,
        false,
        layerList,
    );

    failedLayers = failedLayers.map(fl => ({
        id: fl,
        parentLayer: nestedVal(layerList.find(ll => ll.id === fl), ['parentLayer']),
    }));

    await Promise.all(layersToBeActivated.map(async (layer) => {
        if (!failedLayers.some(fl => fl.id === layer.id)
            && !failedLayers.some(fl => fl.parentLayer === layer.id)) {
            if (layer.id === activeAdminTool) {
                dispatch({
                    type: types.SET_ACTIVE_ADMIN_TOOL,
                    layerId: '',
                    layerList: dispatch(getState).map.layerGroups.layerList,
                });
            }

            if (layer.type === 'agfl' && layer._source !== 'search') {
                if (workspace === undefined) dispatch(addNonSpatialContentToTable(layer));
            } else {
                const layerToUpdate = await getSingleLayerFields({ ...layer, failOnLoad: false });
                await setLayerLegend(
                    layerToUpdate,
                    dispatch(getState).map.mapView.view,
                );

                const workspaceLayer = workspace !== undefined
                    && (layer.definitionExpression
                        ? workspace.layers.find(wl => wl.definitionExpression
                            && (wl.layerId === layer.id.replace('_s', '')
                                || wl.userLayerId === layer.id.replace('_s', '')))
                        : workspace.layers.find(wl => wl.layerId === layer.id
                            || wl.userLayerId === layer.id));

                let visible = true;
                if (layer.parentLayer && layersToBeActivated
                    .some(l => l.id === layer.parentLayer)) {
                    visible = layer.name.toLowerCase().includes('voimassaoleva');
                }

                dispatch({
                    type: types.UPDATE_LAYER,
                    layer: {
                        ...layerToUpdate,
                        active: true,
                        visible: workspaceLayer
                            ? workspaceLayer.visible
                            : visible,
                        opacity: workspaceLayer
                            ? workspaceLayer.opacity
                            : layer.opacity,
                    },
                });

                if (workspace === undefined) {
                    const reorderedLayerList = reorderLayers(
                        dispatch(getState).map.layerGroups.layerGroups,
                        dispatch(getState).map.layerGroups.layerList,
                        layer,
                    );

                    dispatch(setLayerList(reorderedLayerList));
                }
            }
        } else {
            const foundLayer = layerList.find(l => l.id === layer.id);

            dispatch({
                type: types.DEACTIVATE_LAYER,
                layerId: foundLayer.id,
                failOnLoad: true,
            });

            if (foundLayer.parentLayer) {
                dispatch({
                    type: types.DEACTIVATE_LAYER,
                    layerId: foundLayer.parentLayer,
                    failOnLoad: true,
                });
            }
        }
    }));

    if (workspace !== undefined) dispatch(setWorkspaceFeatures(workspace, layersToBeActivated));
};

export const toggleLayerLegend = (forceToggle?: boolean) => (dispatch: Function) => {
    const { layerLegendActive, manualClose } = store.getState().map.layerLegend;

    if (forceToggle && layerLegendActive) {
        dispatch({
            type: types.TOGGLE_LAYER_LEGEND,
            manualClose: true,
        });
    }

    if (forceToggle && !layerLegendActive) {
        if (shouldToggleLayerLegend(dispatch)) {
            dispatch({
                type: types.TOGGLE_LAYER_LEGEND,
                manualClose: false,
            });
        } else {
            toast.error(strings.mapLayers.noLayerLegendToShow);
        }
    }

    if (!forceToggle && !manualClose) {
        shouldToggleLayerLegend(dispatch);
    }
};

const getSelectedLayersAndFeatures = (dispatch: Function, state: Object) => {
    const selectedLayers = [];
    state.table.features.layers.forEach((l) => {
        const allSelected = !l.data.some(f => !f._selected);
        const selectedTableFeatures = l.data
            .filter(f => f._selected);
        if (selectedTableFeatures.length && l.data
            .filter(f => !f._selected)) {
            selectedLayers.push({
                id: l.id,
                selectedTableFeatures,
                allSelected,
            });
        }
        if (allSelected) {
            dispatch({
                type: types.CLOSE_LAYER,
                layerId: l.id,
            });
        }
    });
    return selectedLayers;
};

const addSelectedFeaturesForFetching = (allLayers: Object[], layer: Object, selectedLayer: Object, fetchSelected: Map) => {
    const siblingLayers = getSiblingsOrSelf(allLayers, layer);
    siblingLayers.forEach((l) => {
        let selectedFeatures;
        if (selectedLayer.selectedTableFeatures) {
            selectedFeatures = selectedLayer.selectedTableFeatures.map(f => f[`${f._layerId}/OBJECTID`]);
        }
        if (fetchSelected.get(l)) {
            const oldValue = fetchSelected.get(l);
            fetchSelected.set(l, oldValue.concat(selectedFeatures));
        } else {
            fetchSelected.set(l, selectedFeatures);
        }
    });
};

export const updateRelatedLayersData = (
    layers: Object[],
) => (dispatch: Function, getState: Function) => {
    const state = dispatch(getState);
    const allLayers = state.map.layerGroups.layerList;
    const fetchSelected = new Map();

    const selectedLayers = getSelectedLayersAndFeatures(dispatch, state);
    const relatedLayers = getRelatedLayers(allLayers, layers);

    state.map.mapView.view.popup.close();
    let searchMap;
    relatedLayers.forEach(async (layer) => {
        if (layer._source !== 'search') {
            const selectedLayer = selectedLayers.find(l => l.id === layer.id);
            if (selectedLayers.some(l => l.id === layer.id)) {
                addSelectedFeaturesForFetching(allLayers, layer, selectedLayer, fetchSelected);
            }
            if (layer.active) {
                const view = state.map.mapView.view
                    .allLayerViews.find(v => v.layer.id === layer.id);
                if (view && view.layer) view.layer.refresh();
            }
            if (state.table.features.layers.some(l => l.id === layer.id)) {
                const features = (selectedLayer)
                    ? selectedLayer.selectedTableFeatures : undefined;
                if (!selectedLayer || !selectedLayer.allSelected) {
                    dispatch(addNonSpatialContentToTable(layer, undefined, true, features));
                }
            }
        } else if (!searchMap) {
            if (layer.originalQueryMap) {
                searchMap = layer.originalQueryMap;
            }
        }
    });
    if (searchMap) {
        dispatch(searchFeatures(searchMap));
    }
    if (fetchSelected.size) {
        const promises = [];
        fetchSelected.forEach((value, key) => {
            promises.push(fetchSearchQuery(
                key.id,
                `OBJECTID IN (${value.join(',')})`,
                key.name,
                { layers: [] },
            ));
        });
        Promise.all(promises).then((r) => {
            r.forEach((res) => {
                if (res.layers.some(l => l.features.length)) dispatch(selectFeatures(res));
            });
        });
    }
};

export const deactivateLayer = (layerId: string) => (dispatch: Function, getState: Function) => {
    const { layerList } = dispatch(getState).map.layerGroups;

    dispatch({
        type: types.DEACTIVATE_LAYER,
        layerId,
    });

    dispatch({
        type: types.REMOVE_LAYER_FROM_VIEW,
        layerIds: [layerId],
    });

    const childLayers = layerList.filter(ll => ll.parentLayer === layerId);
    if (childLayers.length) {
        childLayers.forEach((childLayer) => {
            dispatch({
                type: types.DEACTIVATE_LAYER,
                layerId: childLayer.id,
            });
        });

        dispatch({
            type: types.REMOVE_LAYER_FROM_VIEW,
            layerIds: childLayers.map(childLayer => childLayer.id),
        });
    }

    shouldToggleLayerLegend(dispatch);
    closeTableIfNothingToShow();
};

export const getActiveLayerTab = () => ({
    type: types.GET_ACTIVE_LAYER_TAB,
});

export const setActiveLayerTab = (tab: string) => ({
    type: types.SET_ACTIVE_LAYER_TAB,
    tab,
});

export const getMapConfig = () => (dispatch: Function) => {
    dispatch({ type: types.GET_MAP_CONFIG });
    fetchMapConfig()
        .then(r => dispatch({
            type: types.GET_MAP_CONFIG_FULFILLED,
            mapCenter: r.center,
            mapScale: r.scale,
            printServiceUrl: r.printServiceUrl,
            extractServiceUrl: r.extractServiceUrl,
        }))
        .catch(err => console.error(err));
};

export const setMapView = (view: any) => ({
    type: types.SET_MAP_VIEW,
    view,
});

export const setTempGraphicsLayer = (graphicsLayer: Object) => ({
    type: types.SET_GRAPH_LAYER,
    graphicsLayer,
});

export const setMapTools = (draw: Object, sketchViewModel: Object) => ({
    type: types.SET_MAP_TOOLS,
    draw,
    sketchViewModel,
});

export const setActiveTool = (active: string) => ({
    type: types.SET_ACTIVE_TOOL,
    active,
});

export const setActiveFeatureMode = (activeFeatureMode: string) => ({
    type: types.SET_ACTIVE_FEATURE_MODE,
    activeFeatureMode,
});

export const setSnappingFeatureSources = (featureSources: Object) => ({
    type: types.SET_SNAPPING_FEATURE_SOURCES,
    featureSources,
});

export const addUserLayer = (layerValues: Object) => (dispatch: Function) => {
    fetchAddUserLayer(layerValues)
        .then((l) => {
            if (!l.error) {
                if (l.type === 'agfs') {
                    layerData(l.id)
                        .then((layer: Object) => {
                            l.fields = layer.fields && layer.fields.map((f, index) => ({
                                value: index, label: f.alias, type: f.type, name: f.name,
                            }));
                            return l;
                        })
                        .then((r) => {
                            const userLayer = {
                                ...r,
                                active: false,
                                layerGroupName: strings.mapLayers.userLayerGroupName,
                            };

                            dispatch({
                                type: types.ADD_USER_LAYER,
                                layer: userLayer,
                            });
                            dispatch(activateLayers([userLayer]));
                        })
                        .catch(err => console.error(err));
                } else {
                    const userLayer = {
                        ...l,
                        active: false,
                        layerGroupName: strings.mapLayers.userLayerGroupName,
                    };

                    dispatch({
                        type: types.ADD_USER_LAYER,
                        layer: userLayer,
                    });
                    dispatch(activateLayers([userLayer]));
                }
            }
        })
        .catch(err => console.error(err));
};

export const removeUserLayer = (layerId: string) => ({
    type: types.REMOVE_USER_LAYER,
    layerId,
});

export const removeUserLayerConfirmed = (
    layerId: string,
    layerList: Array<Object>,
) => (dispatch: Function) => {
    deleteUserLayer(layerId).then((res) => {
        if (res.ok) {
            dispatch({
                type: types.REMOVE_LAYER_FROM_VIEW,
                layerIds: [layerId],
            });
            dispatch({
                type: types.SET_LAYER_LIST,
                layerList: layerList.filter(l => l.id !== layerId),
            });
            dispatch({
                type: types.REMOVE_USER_LAYER_FULFILLED,
                layerId,
            });
        }
    }).catch(e => console.error(e));
};

export const addShapefile = (layer: Object) => ({
    type: types.ADD_SHAPEFILE_LAYER,
    layer,
});

export const setMapDrawText = (text: string) => ({
    type: types.SET_MAP_DRAW_TEXT,
    drawText: text,
});

export const setActiveToolMenu = (activeToolMenu: string) => ({
    type: types.SET_ACTIVE_TOOL_MENU,
    activeToolMenu,
});

export const setHasGraphics = (hasGraphics: boolean) => ({
    type: types.SET_HAS_GRAPHICS,
    hasGraphics,
});

export const removeLayersView = (layerIds: Array<number>) => ({
    type: types.REMOVE_LAYER_FROM_VIEW,
    layerIds,
});

export const toggleLayer = (layerId: string) => (dispatch: Function) => {
    dispatch({
        type: types.TOGGLE_LAYER,
        layerId,
    });

    shouldToggleLayerLegend(dispatch);
};

export const toggleMeasurements = () => ({
    type: types.TOGGLE_MEASUREMENTS,
});

export const setScale = (mapScale: number) => (dispatch: Function) => {
    dispatch({
        type: types.SET_SCALE,
        mapScale,
    });

    shouldToggleLayerLegend(dispatch);
};

export const hideLayer = (layerIds: string[]) => ({
    type: types.HIDE_LAYER,
    layerIds,
});

export const toggleIndexMap = () => ({
    type: types.TOGGLE_INDEX_MAP,
});

export const toggleLayerVisibleZoomOut = (layerId, originalMinScale) => (dispatch: Function) => {
    dispatch({
        type: types.TOGGLE_LAYER_VISIBLE_ZOOM_OUT,
        layerId,
        originalMinScale,
    });

    shouldToggleLayerLegend(dispatch);
};
