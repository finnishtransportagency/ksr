// @flow
import { SHOW_CONFIRM_MODAL, HIDE_CONFIRM_MODAL } from '../../constants/actionTypes';

const initialState = {
    show: false,
    body: '',
    acceptText: '',
    cancelText: '',
    accept: () => {},
};

type Action = {
    type: string,
    show: boolean,
    body: string,
    acceptText: string,
    cancelText: string,
    accept: Function,
};

export default (state: Object = initialState, action: Action) => {
    switch (action.type) {
        case SHOW_CONFIRM_MODAL:
            return {
                show: true,
                body: action.body,
                acceptText: action.acceptText,
                cancelText: action.cancelText,
                accept: action.accept,
            };
        case HIDE_CONFIRM_MODAL:
            return initialState;
        default:
            return state;
    }
};
