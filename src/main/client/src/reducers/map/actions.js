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
