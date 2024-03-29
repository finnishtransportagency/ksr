// @flow
import { SHOW_CONFIRM_MODAL, HIDE_CONFIRM_MODAL } from '../../constants/actionTypes';

const initialState = {
    show: false,
    body: '',
    acceptText: '',
    cancelText: '',
    accept: () => {},
    cancel: () => {},
};

type Action = {
    type: string,
    show: boolean,
    body: string,
    acceptText: string,
    cancelText: string,
    accept: Function,
    cancel?: Function,
};

export default (state: Object = initialState, action: Action): | any
  | {
    accept: any,
    acceptText: string,
    body: string,
    cancel: any | void,
    cancelText: string,
    show: boolean,
    ...
  }
  | {
    accept: () => void,
    acceptText: string,
    body: string,
    cancel: () => void,
    cancelText: string,
    show: boolean,
    ...
  } => {
    switch (action.type) {
        case SHOW_CONFIRM_MODAL:
            return {
                show: true,
                body: action.body,
                acceptText: action.acceptText,
                cancelText: action.cancelText,
                accept: action.accept,
                cancel: action.cancel,
            };
        case HIDE_CONFIRM_MODAL:
            return initialState;
        default:
            return state;
    }
};
