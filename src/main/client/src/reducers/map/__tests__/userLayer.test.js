import * as types from '../../../constants/actionTypes';
import reducer from '../userLayer';

describe('userLayer - reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            layerToRemove: null,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should set layerToRemove -property', () => {
        const initialState = {
            layerToRemove: null,
        };

        const action = {
            type: types.REMOVE_USER_LAYER,
            layerId: '123467',
        };

        const expected = {
            layerToRemove: '123467',
        };

        expect(reducer(initialState, action)).toEqual(expected);
    });

    it('should clear layerToRemove -property', () => {
        const initialState = {
            layerToRemove: '123456',
        };

        const action = {
            type: types.REMOVE_USER_LAYER_FULFILLED,
        };

        const expected = {
            layerToRemove: null,
        };

        expect(reducer(initialState, action)).toEqual(expected);
    });
});
