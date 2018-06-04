// @flow
import * as types from '../../constants/actionTypes';

export const getWmsLayers = () => ({
    type: types.GET_WMS_LAYERS,
});

export const setWmsLayers = () => ({
    type: types.SET_WMS_LAYERS,
});

export const getWmtsLayers = () => ({
    type: types.GET_WMTS_LAYERS,
});

export const setWmtsLayers = () => ({
    type: types.SET_WMTS_LAYERS,
});

export const getLayerGroups = () => ({
    type: types.GET_LAYER_GROUPS,
});

export const getActiveLayerTab = () => ({
    type: types.GET_ACTIVE_LAYER_TAB,
});

export const setActiveLayerTab = (tab: string) => ({
    type: types.SET_ACTIVE_LAYER_TAB,
    tab,
});

export const getActiveLayers = () => ({
    type: types.GET_ACTIVE_LAYERS,
});

export const setActiveLayers = () => ({
    type: types.SET_ACTIVE_LAYERS,
});
