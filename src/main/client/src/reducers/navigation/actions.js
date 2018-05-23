// @flow
import * as types from '../../constants/actionTypes';

export const getActiveNav = () => ({
    type: types.GET_ACTIVE_NAV,
});

export const setActiveNav = (selectedNav: string) => ({
    type: types.SET_ACTIVE_NAV,
    selectedNav,
});
