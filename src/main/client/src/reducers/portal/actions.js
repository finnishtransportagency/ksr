// @flow
import * as types from '../../constants/actionTypes';

export const togglePortal = () => ({
    type: types.TOGGLE_PORTAL,
});

export const updatePortal = () => () => {
    const ev = new Event('windowPortalUpdate', {});
    window.dispatchEvent(ev);
};
