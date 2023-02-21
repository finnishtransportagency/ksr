// @flow
import * as types from '../../constants/actionTypes';

/** Sets fullscreen loading. */
export const setLoading = (): { type: any, ... } => ({ type: types.SET_LOADING });

/** Removes fullscreen loading. */
export const removeLoading = (): { type: any, ... } => ({ type: types.REMOVE_LOADING });

/**
 * Sets given layers to loading state.
 *
 * @param {string[]} layerIds List of layer Id's to be set to loading state.
 */
export const setLoadingLayers = (layerIds: Array<string>): { layerIds: Array<string>, type: any, ... } => ({
    type: types.SET_LOADING_LAYERS,
    layerIds,
});

/**
 * Remove layer from loading state.
 *
 * @param {string} layerId Layer to be removed from loading state.
 */
export const removeLoadingLayer = (layerId: string): { layerId: string, type: any, ... } => ({
    type: types.REMOVE_LOADING_LAYER,
    layerId,
});

/**
 * Remove multiple layers from loading state.
 *
 * @param {string[]} layerIds Layers to be removed from loading state.
 */
export const removeLoadingLayers = (layerIds: Array<string>): { layerIds: Array<string>, type: any, ... } => ({
    type: types.REMOVE_LOADING_LAYERS,
    layerIds,
});
