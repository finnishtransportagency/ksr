// @flow
import { fetchLayerGroups } from '../../api/map-layers/layerGroups';
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
        .then(r => dispatch({ type: types.GET_LAYER_GROUPS_FULFILLED, layerGroups: r, layerList }))
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
