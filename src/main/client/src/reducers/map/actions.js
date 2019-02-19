// @flow
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { layerData } from '../../api/map/layerData';
import { fetchAddUserLayer } from '../../api/user-layer/addUserLayer';
import { deleteUserLayer } from '../../api/user-layer/deleteUserLayer';
import * as types from '../../constants/actionTypes';
import { addLayers, getSingleLayerFields } from '../../utils/map';
import { reorderLayers } from '../../utils/reorder';
import { addNonSpatialContentToTable } from '../table/actions';
import { getLayerLegend } from '../../utils/layerLegend';
import { setWorkspaceFeatures } from '../workspace/actions';

export const getLayerGroups = () => async (dispatch: Function) => {
    dispatch({ type: types.GET_LAYER_GROUPS });

    const layerGroups = await fetchLayerGroups();
    const layerList = layerGroups
        .flatMap(lg => lg.layers.map(layer => ({ ...layer, layerGroupName: lg.name })))
        .sort((a, b) => b.layerOrder - a.layerOrder);

    return dispatch({
        type: types.GET_LAYER_GROUPS_FULFILLED,
        layerGroups: layerGroups.map(lg => ({
            ...lg,
            layers: lg.layers.map(layer => layer),
        })),
        layerList,
    });
};

export const setLayerList = (layerList: Array<any>) => ({
    type: types.SET_LAYER_LIST,
    layerList,
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

    view.popup.close();

    dispatch({
        type: types.SET_LOADING_LAYERS,
        layerIds: layers.map(l => l.id),
    });

    const { failedLayers } = await addLayers(
        layers,
        view,
        workspace !== undefined,
    );

    await Promise.all(layers.map(async (layer) => {
        if (!failedLayers.some(layerId => layerId === layer.id)) {
            if (layer.id === activeAdminTool) {
                dispatch({
                    type: types.SET_ACTIVE_ADMIN_TOOL,
                    layerId: '',
                    layerList: dispatch(getState).map.layerGroups.layerList,
                });
            }

            if (layer.type === 'agfl') {
                if (workspace === undefined) dispatch(addNonSpatialContentToTable(layer));
            } else {
                let layerToUpdate = await getSingleLayerFields({ ...layer, failOnLoad: false });
                layerToUpdate = await getLayerLegend(
                    layerToUpdate,
                    dispatch(getState).map.mapView.view,
                );

                const workspaceLayer = workspace !== undefined && workspace.layers
                    .find(wl => wl.layerId === layer.id || wl.userLayerId === layer.id);

                dispatch({
                    type: types.UPDATE_LAYER,
                    layer: {
                        ...layerToUpdate,
                        active: true,
                        visible: workspaceLayer
                            ? workspaceLayer.visible
                            : true,
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
            dispatch({
                type: types.DEACTIVATE_LAYER,
                layerId: layer.id,
                failOnLoad: true,
            });
        }
    }));

    if (workspace !== undefined) dispatch(setWorkspaceFeatures(workspace, layers));
};

export const deactivateLayer = (layerId: string) => (dispatch: Function) => {
    dispatch({
        type: types.DEACTIVATE_LAYER,
        layerId,
    });

    dispatch({
        type: types.REMOVE_LAYER_FROM_VIEW,
        layerIds: [layerId],
    });
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
                        .then((layer) => {
                            l.fields = layer.fields && layer.fields.map((f, index) => ({
                                value: index, label: f.alias, type: f.type, name: f.name,
                            }));
                            return l;
                        })
                        .then((r) => {
                            const userLayer = {
                                ...r,
                                active: false,
                                layerGroupName: 'Käyttäjätasot',
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
                        layerGroupName: 'Käyttäjätasot',
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

export const toggleLayerLegend = () => ({
    type: types.TOGGLE_LAYER_LEGEND,
});

export const toggleLayer = (layerId: string) => ({
    type: types.TOGGLE_LAYER,
    layerId,
});

export const toggleMeasurements = () => ({
    type: types.TOGGLE_MEASUREMENTS,
});
