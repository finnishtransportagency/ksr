// @flow
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { layerData } from '../../api/map/layerData';
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
                        });
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
