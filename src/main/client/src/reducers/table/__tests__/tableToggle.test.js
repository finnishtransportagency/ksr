import * as types from '../../../constants/actionTypes';
import reducer from '../toggleTable';

describe('table reducer', () => {
    it('should return initial state', () => {
        const initialState = false;

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle TOGGLE_TABLE', () => {
        expect(reducer(undefined, {
            type: types.TOGGLE_TABLE,
        })).toEqual(true);
    });
});
