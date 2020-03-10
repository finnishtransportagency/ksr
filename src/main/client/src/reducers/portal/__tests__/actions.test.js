import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to toggle portal', () => {
        const expectedAction = {
            type: types.TOGGLE_PORTAL,
        };
        expect(actions.togglePortal()).toEqual(expectedAction);
    });
});
