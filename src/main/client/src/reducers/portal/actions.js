// @flow
import * as types from '../../constants/actionTypes';

export const setActivePortal = (activePortal: string) => ({
    type: types.SET_ACTIVE_PORTAL,
    activePortal,
});
