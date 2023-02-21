// @flow
import * as types from '../../constants/actionTypes';

export const showConfirmModal = (
    body: string,
    acceptText: string,
    cancelText: string,
    accept: Function,
    cancel?: Function,
): {
  accept: any,
  acceptText: string,
  body: string,
  cancel: any | void,
  cancelText: string,
  type: any,
  ...
} => ({
    type: types.SHOW_CONFIRM_MODAL,
    body,
    acceptText,
    cancelText,
    accept,
    cancel,
});

export const hideConfirmModal = (): { type: any, ... } => ({
    type: types.HIDE_CONFIRM_MODAL,
});
