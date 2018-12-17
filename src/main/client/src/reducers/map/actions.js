// @flow
import { toast } from 'react-toastify';
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { layerData } from '../../api/map/layerData';
import { fetchAddUserLayer } from '../../api/user-layer/addUserLayer';
import { deleteUserLayer } from '../../api/user-layer/deleteUserLayer';
import * as types from '../../constants/actionTypes';
import strings from '../../translations/';

export const getLayerGroups = () => (dispatch: Function) => {
    dispatch({ type: types.GET_LAYER_GROUPS });
    const layerList = [];
    const layerQueries = [];
    const layersToRemove = [];
    toast.info(strings.mapLayers.loadingLayers, {
        toastId: 'loadingLayers',
        autoClose: false,
    });
    fetchLayerGroups()
        .then((r) => {
            r.map(lg => lg.layers.map(l => layerList.push(l)));
            layerList.sort((a, b) => b.layerOrder - a.layerOrder);
            return r;
        })
        .then((r) => {
            layerList.forEach((l) => {
                if (l.type === 'agfs' || l.type === 'agfl') {
                    // Add featurelayer fields and geometryType to layerList
                    layerQueries.push(layerData(l.id)
                        .then((layers) => {
                            if (!layers.error) {
                                l.geometryType = layers.geometryType;
                                l.fields =
                                    layers.fields && layers.fields.map((f, index) => ({
                                        value: index,
                                        label: f.alias,
                                        type: f.type,
                                        name: f.name,
                                        editable: f.editable,
                                        nullable: f.nullable,
                                        length: f.length,
                                        domain: f.domain ? {
                                            type: f.domain.type,
                                            name: f.domain.name,
                                            description: f.domain.description,
                                            codedValues: f.domain.codedValues,
                                        } : null,
                                    }));
                            } else {
                                toast.error(`${strings.mapLayers.failedToLoadLayer} [${l.name}]`);
                                layersToRemove.push(l.id);
                                layerList.find((ll, index) => (
                                    ll.id === l.id && layerList.splice(index, 1)
                                ));
                            }
                        })
                        .catch(err => console.log(err)));
                }
            });
            Promise.all(layerQueries)
                .then(() => r)
                .then((layerGroups) => {
                    toast.dismiss('loadingLayers');
                    return dispatch({
                        type: types.GET_LAYER_GROUPS_FULFILLED,
                        layerGroups: layerGroups.map(lg => ({
                            ...lg,
                            layers: lg.layers.filter(l => !layersToRemove.includes(l.id)),
                        })),
                        layerList,
                    });
                });
        })
        .catch(err => console.log(err));
};

export const setLayerList = (layerList: Array<any>) => ({
    type: types.SET_LAYER_LIST,
    layerList,
});

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

export const addUserLayer = (layerValues: Object) => (dispatch: Function) => {
    fetchAddUserLayer(layerValues)
        .then((l) => {
            if (!l.error) {
                if (l.type === 'agfs') {
                    layerData(l.id)
                        .then((layer) => {
                            l.fields =
                                layer.fields && layer.fields.map((f, index) => ({
                                    value: index, label: f.alias, type: f.type, name: f.name,
                                }));
                            return l;
                        })
                        .then((r) => {
                            dispatch({
                                type: types.ADD_USER_LAYER,
                                layer: {
                                    ...r,
                                    active: r.visible,
                                },
                            });
                        })
                        .catch(err => console.log(err));
                } else {
                    dispatch({
                        type: types.ADD_USER_LAYER,
                        layer: {
                            ...l,
                            active: l.visible,
                        },
                    });
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
    layerId: String,
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
