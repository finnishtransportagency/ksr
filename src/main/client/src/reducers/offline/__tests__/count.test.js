import countReducer from '../count';
import { ADD_EDIT, SET_EDITS } from '../../../constants/actionTypes';


describe('recuders - offline - count', () => {
    it('should return inital count', () => {
        expect(countReducer(undefined, {})).toBe(0);
    });

    it('should increase count by one', () => {
        expect(countReducer(4, { type: ADD_EDIT })).toBe(5);
    });

    it('should set count', () => {
        expect(countReducer(3, { type: SET_EDITS, count: 123 })).toBe(123);
    });
});
