// @flow
import * as types from '../../constants/actionTypes';

/** Sets fullscreen loading. */
export const setLoading = () => ({ type: types.SET_LOADING });

/** Removes fullscreen loading. */
export const removeLoading = () => ({ type: types.REMOVE_LOADING });

/**
 * Sets given layers to loading state.
 *
 * @param {string[]} layerIds List of layer Id's to be set to loading state.
 */
export const setLoadingLayers = (layerIds: string[]) => ({
    type: types.SET_LOADING_LAYERS,
    layerIds,
});

/**
 * Remove layer from loading state.
 *
 * @param {string} layerId Layer to be removed from loading state.
 */
export const removeLoadingLayer = (layerId: string) => ({
    type: types.REMOVE_LOADING_LAYER,
    layerId,
});
