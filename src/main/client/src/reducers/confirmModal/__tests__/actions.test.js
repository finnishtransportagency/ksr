import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to SHOW confirm modal', () => {
        const body = '';
        const acceptText = '';
        const cancelText = '';
        const accept = () => {};

        const expectedAction = {
            type: types.SHOW_CONFIRM_MODAL,
            body,
            acceptText,
            cancelText,
            accept,
        };

        expect(actions.showConfirmModal(body, acceptText, cancelText, accept))
            .toEqual(expectedAction);
    });

    it('should create an action to HIDE confirm modal', () => {
        const expectedAction = { type: types.HIDE_CONFIRM_MODAL };

        expect(actions.hideConfirmModal()).toEqual(expectedAction);
    });
});
