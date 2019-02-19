// @flow
import * as types from '../../constants/actionTypes';

export const setActiveModal = (activeModal: string, data?: any) => ({
    type: types.SET_ACTIVE_MODAL,
    activeModal,
    data,
});

export const toggleDropzoneActive = () => ({
    type: types.TOGGLE_DROPZONE_ACTIVE,
});
