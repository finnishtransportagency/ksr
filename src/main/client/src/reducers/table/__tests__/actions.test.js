import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to toggle table', () => {
        const expectedAction = {
            type: types.TOGGLE_TABLE,
        };
        expect(actions.toggleTable()).toEqual(expectedAction);
    });
});
