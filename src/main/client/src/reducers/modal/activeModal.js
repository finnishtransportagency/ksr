// @flow
import { SET_ACTIVE_MODAL } from '../../constants/actionTypes';

const initialState = {
    activeModal: '',
    data: null,
};

type State = {
    activeModal: string,
    data: any,
};

type Action = {
    activeModal: string,
    data: any,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_ACTIVE_MODAL:
            return {
                ...state,
                activeModal: action.activeModal,
                data: action.data,
            };
        default:
            return state;
    }
};
