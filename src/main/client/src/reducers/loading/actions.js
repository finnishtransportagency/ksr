// @flow
import * as types from '../../constants/actionTypes';

/** Sets fullscreen loading. */
export const setLoading = () => ({ type: types.SET_LOADING });

/** Removes fullscreen loading. */
export const removeLoading = () => ({ type: types.REMOVE_LOADING });
