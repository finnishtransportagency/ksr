import * as types from '../../../constants/actionTypes';
import * as actions from '../actions';

describe('actions', () => {
    it('should create an action to toggle table', () => {
        const expectedAction = {
            type: types.TOGGLE_TABLE,
        };
        expect(actions.toggleTable()).toEqual(expectedAction);
    });

    it('should create an action to clear table', () => {
        const expectedAction = {
            type: types.CLEAR_TABLE_DATA,
        };
        expect(actions.clearTableData()).toEqual(expectedAction);
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
