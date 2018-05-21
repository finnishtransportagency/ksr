import * as types from '../../constants/actionTypes';

export const getActiveNav = () => ({
    type: types.GET_ACTIVE_NAV,
});

export const setActiveNav = selectedNav => ({
    type: types.SET_ACTIVE_NAV,
    selectedNav,
});
