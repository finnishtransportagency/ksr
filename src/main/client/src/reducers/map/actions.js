import { fetchLayerGroups } from '../../api/map-layers/layerGroups';
import { fetchActiveLayers } from '../../api/map-layers/activeLayers';
import * as types from '../../constants/actionTypes';

export const getLayerGroups = () => (dispatch) => {
    dispatch({ type: types.GET_LAYER_GROUPS });
    fetchLayerGroups()
        .then(r => dispatch({ type: types.GET_LAYER_GROUPS_FULFILLED, payload: r }))
        .catch(err => console.log(err));
};

export const getActiveLayerTab = () => ({
    type: types.GET_ACTIVE_LAYER_TAB,
});

export const setActiveLayerTab = (tab: string) => ({
    type: types.SET_ACTIVE_LAYER_TAB,
    tab,
});

export const getActiveLayers = () => (dispatch) => {
    dispatch({ type: types.GET_ACTIVE_LAYERS });
    fetchActiveLayers()
        .then(r => dispatch({ type: types.GET_ACTIVE_LAYERS_FULFILLED, payload: r }))
        .catch(err => console.log(err));
};

export const setActiveLayers = () => ({
    type: types.SET_ACTIVE_LAYERS,
});
