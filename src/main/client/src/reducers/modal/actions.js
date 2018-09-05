// @flow
import * as types from '../../constants/actionTypes';

export const setActiveModal = (activeModal: string) => ({
    type: types.SET_ACTIVE_MODAL,
    activeModal,
});

export const setDropzoneActive = () => ({
    type: types.SET_DROPZONE_ACTIVE,
});
