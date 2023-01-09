import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe.skip('actions', () => {
    it('should create an action to toggle table', () => {
        const expectedAction = {
            type: types.TOGGLE_TABLE,
        };
        expect(actions.toggleTable()).toEqual(expectedAction);
    });

    it('should create an action to set single layer geometry', () => {
        const geometry = {};
        const expectedAction = {
            type: types.SET_SINGLE_LAYER_GEOMETRY,
            geometry,
        };
        expect(actions.setSingleLayerGeometry(geometry)).toEqual(expectedAction);
    });
});
