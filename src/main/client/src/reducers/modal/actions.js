// @flow
import * as types from '../../constants/actionTypes';

export const setActiveModal = (activeModal: string, data?: any): { activeModal: string, data: any | void, type: any, ... } => ({
    type: types.SET_ACTIVE_MODAL,
    activeModal,
    data,
});
