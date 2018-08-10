// @flow
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { fetchSearchFields } from '../../api/search/searchFields';
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
                    // Add featurelayer fields to layer
                    fetchSearchFields(l.id)
                        .then((fields) => {
                            layerList[i].fields = fields;
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
