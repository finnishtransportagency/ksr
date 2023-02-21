// @flow
import * as types from '../../constants/actionTypes';

export const getActiveNav = (): { type: any, ... } => ({
    type: types.GET_ACTIVE_NAV,
});

export const setActiveNav = (selectedNav: string): { selectedNav: string, type: any, ... } => ({
    type: types.SET_ACTIVE_NAV,
    selectedNav,
});
