// @flow
import { SET_ACTIVE_MODAL, TOGGLE_DROPZONE_ACTIVE } from '../../constants/actionTypes';

const initialState = {
    activeModal: '',
    dropzone: false,
    data: null,
};

type State = {
    activeModal: string,
    dropzone: boolean,
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
        case TOGGLE_DROPZONE_ACTIVE:
            return {
                ...state,
                dropzone: !state.dropzone,
            };
        default:
            return state;
    }
};
