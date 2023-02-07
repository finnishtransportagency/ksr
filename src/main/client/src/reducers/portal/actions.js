// @flow
import * as types from '../../constants/actionTypes';

export const togglePortal = (): { type: any, ... } => ({
    type: types.TOGGLE_PORTAL,
});

export const updatePortal = (): (() => void) => () => {
    const ev = new Event('windowPortalUpdate', {});
    window.dispatchEvent(ev);
};
