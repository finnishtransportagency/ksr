// @flow
import { fetchLayerGroups } from '../../api/map/layerGroups';
import { fetchMapConfig } from '../../api/map/mapConfig';
import { fetchSearchFields } from '../../api/search/searchFields';
import * as types from '../../constants/actionTypes';

export const getLayerGroups = () => (dispatch: Function) => {
    dispatch({ type: types.GET_LAYER_GROUPS });
    const layerList = [];
    const queryableLayers = [];
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

            // Add queryableLayers for search component
            layerList.forEach(l => l.active && l.queryable &&
                queryableLayers.push({ value: l.id, label: l.name }));
            return r;
        })
        .then(r => dispatch({
            type: types.GET_LAYER_GROUPS_FULFILLED,
            layerGroups: r,
            layerList,
            queryableLayers,
        }))
        .catch(err => console.log(err));
};

export const setLayerList = (layerList: Array<any>) => (dispatch: Function) => {
    const queryableLayers = [];
    layerList.forEach(l => l.active && l.visible && l.queryable &&
        queryableLayers.push({ value: l.id, label: l.name }));
    dispatch({ type: types.SET_LAYER_LIST, layerList, queryableLayers });
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
        }))
        .catch(err => console.log(err));
};
