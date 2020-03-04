import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to SET active portal', () => {
        const expectedAction = { type: types.SET_ACTIVE_PORTAL, activePortal: 'test' };

        expect(actions.setActivePortal('test')).toEqual(expectedAction);
    });
});
