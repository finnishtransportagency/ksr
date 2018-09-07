// @flow
import { SET_ACTIVE_MODAL, SET_DROPZONE_ACTIVE } from '../../constants/actionTypes';

const initialState = {
    activeModal: '',
    dropzone: false,
};

type State = {
    activeModal: string,
    dropzone: boolean,
};

type Action = {
    activeModal: string,
    type: string,
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_ACTIVE_MODAL:
            return {
                ...state,
                activeModal: action.activeModal,
            };
        case SET_DROPZONE_ACTIVE:
            return {
                ...state,
                dropzone: !state.dropzone,
            };
        default:
            return state;
    }
};
