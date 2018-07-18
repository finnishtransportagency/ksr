// @flow
import { SET_ACTIVE_MODAL } from '../../constants/actionTypes';

const initialState = '';

type State = string;

type Action = {
    activeModal: string,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_ACTIVE_MODAL:
            return action.activeModal;
        default:
            return state;
    }
};
