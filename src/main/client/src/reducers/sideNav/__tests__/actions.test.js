import * as types from '../../../constants/action-types';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to get active nav', () => {
        const expectedAction = { type: types.GET_ACTIVE_NAV };
        expect(actions.getActiveNav()).toEqual(expectedAction);
    });

    it('should create an action to set active nav', () => {
        const payload = 'mapLayers';
        const expectedAction = {
            type: types.SET_ACTIVE_NAV,
            payload,
        };
        expect(actions.setActiveNav(payload)).toEqual(expectedAction);
    });
});
