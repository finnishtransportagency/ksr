// @flow
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { layerData } from '../../api/map/layerData';
import { fetchAddUserLayer } from '../../api/user-layer/addUserLayer';
import { deleteUserLayer } from '../../api/user-layer/deleteUserLayer';
import * as types from '../../constants/actionTypes';
import { addLayers, getSingleLayerFields } from '../../utils/map';
import { reorderChildLayers, reorderLayers } from '../../utils/reorder';
import { addNonSpatialContentToTable } from '../table/actions';
import { setLayerLegend } from '../../utils/layerLegend';
import { setWorkspaceFeatures } from '../workspace/actions';
import strings from '../../translations';
import { nestedVal } from '../../utils/nestedValue';
import { closeTableIfNothingToShow } from '../utils';
import store from '../../store';

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
            ).catch(err => console.log(err));
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
                            && (wl.layerId === layer.id.replace('.s', '')
                                || wl.userLayerId === layer.id.replace('.s', '')))
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

export const toggleLayerLegend = () => ({
    type: types.TOGGLE_LAYER_LEGEND,
});

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

    const mapState = store.getState().map;
    const shouldCloseLegend = mapState.layerLegend.layerLegendActive
        && !mapState.layerGroups.layerList
            .some(layer => layer.visible && layer.renderer && layer.id !== layerId);
    if (shouldCloseLegend) {
        dispatch(toggleLayerLegend());
    }
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
        .catch(err => console.log(err));
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
                        .catch(err => console.log(err));
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
        .catch(err => console.log(err));
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
    const mapState = store.getState().map;
    const shouldOpenLegend = mapState.layerGroups.layerList
        .find(layer => layer.id === layerId && layer.visible && layer.renderer)
        && !mapState.layerLegend.layerLegendActive;
    const shouldCloseLegend = !mapState.layerGroups.layerList
        .some(layer => layer.visible && layer.renderer)
        && mapState.layerLegend.layerLegendActive;
    if (shouldCloseLegend || shouldOpenLegend) {
        dispatch(toggleLayerLegend());
    }
};

export const toggleMeasurements = () => ({
    type: types.TOGGLE_MEASUREMENTS,
});

export const setScale = (mapScale: number) => ({
    type: types.SET_SCALE,
    mapScale,
});

export const hideLayer = (layerIds: string[]) => ({
    type: types.HIDE_LAYER,
    layerIds,
});

export const toggleIndexMap = () => ({
    type: types.TOGGLE_INDEX_MAP,
});

export const toggleLayerVisibleZoomOut = (layerId, originalMinScale) => ({
    type: types.TOGGLE_LAYER_VISIBLE_ZOOM_OUT,
    layerId,
    originalMinScale,
});
