// @flow
import * as types from '../../constants/actionTypes';

export const showConfirmModal = (
    body: string,
    acceptText: string,
    cancelText: string,
    accept: Function,
) => ({
    type: types.SHOW_CONFIRM_MODAL,
    body,
    acceptText,
    cancelText,
    accept,
});

export const hideConfirmModal = () => ({
    type: types.HIDE_CONFIRM_MODAL,
});
