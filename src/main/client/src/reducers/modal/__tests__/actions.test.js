import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to SET active modal', () => {
        const expectedAction = { type: types.SET_ACTIVE_MODAL, activeModal: 'test' };

        expect(actions.setActiveModal('test')).toEqual(expectedAction);
    });
});
