// @flow
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { layerData } from '../../api/map/layerData';
import { fetchAddUserLayer } from '../../api/user-layer/addUserLayer';
import { deleteUserLayer } from '../../api/user-layer/deleteUserLayer';
import * as types from '../../constants/actionTypes';

export const getLayerGroups = () => (dispatch: Function) => {
    dispatch({ type: types.GET_LAYER_GROUPS });
    const layerList = [];
    fetchLayerGroups()
        .then((r) => {
            r.map(lg => lg.layers.map(l => layerList.push(l)));
            layerList.sort((a, b) => b.layerOrder - a.layerOrder);
            return r;
        })
        .then((r) => {
            layerList.forEach((l, i) => {
                if (l.type === 'agfs') {
                    // Add featurelayer fields and geometryType to layerList
                    layerData(l.id)
                        .then((layers) => {
                            layerList[i].geometryType = layers.geometryType;
                            layerList[i].fields =
                                layers.fields && layers.fields.map((f, index) => ({
                                    value: index, label: f.alias, type: f.type, name: f.name,
                                }));
                        })
                        .catch(err => console.log(err));
                }
            });
            return r;
        })
        .then(r => dispatch({
            type: types.GET_LAYER_GROUPS_FULFILLED,
            layerGroups: r,
            layerList,
        }))
        .catch(err => console.log(err));
};

export const setLayerList = (layerList: Array<any>) => (dispatch: Function) => {
    dispatch({ type: types.SET_LAYER_LIST, layerList });
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
        }))
        .catch(err => console.log(err));
};

export const setMapView = (view: any) => (dispatch: Function) => {
    dispatch({
        type: types.SET_MAP_VIEW,
        view,
    });
};

export const setTempGrapLayer = (graphicsLayer: Object) => (dispatch: Function) => {
    dispatch({
        type: types.SET_GRAPH_LAYER,
        graphicsLayer,
    });
};

export const setMapTools = (draw: Object, sketchViewModel: Object) => (dispatch: Function) => {
    dispatch({
        type: types.SET_MAP_TOOLS,
        draw,
        sketchViewModel,
    });
};

export const setActiveTool = (active: string) => ({
    type: types.SET_ACTIVE_TOOL,
    active,
});

export const setEditMode = (editMode: string) => ({
    type: types.SET_EDIT_MODE,
    editMode,
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
                layerId,
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
