// @flow
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { layerData } from '../../api/map/layerData';
import { fetchAddUserLayer } from '../../api/user-layer/addUserLayer';
import { deleteUserLayer } from '../../api/user-layer/deleteUserLayer';
import * as types from '../../constants/actionTypes';

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
                                    layerGroupName: 'Käyttäjätasot',
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
                            layerGroupName: 'Käyttäjätasot',
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

export const toggleLayerLegend = () => ({
    type: types.TOGGLE_LAYER_LEGEND,
});
