// @flow
import * as types from '../../constants/actionTypes';

export const showConfirmModal = (
    body: string,
    acceptText: string,
    cancelText: string,
    accept: Function,
    cancel?: Function,
) => ({
    type: types.SHOW_CONFIRM_MODAL,
    body,
    acceptText,
    cancelText,
    accept,
    cancel,
});

export const hideConfirmModal = () => ({
    type: types.HIDE_CONFIRM_MODAL,
});
