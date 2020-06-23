import { TOGGLE_PORTAL } from '../../../constants/actionTypes';
import reducer from '../togglePortal';

describe('portal reducer', () => {
    it('should return initial state', () => {
        const initialState = false;

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle TOGGLE_PORTAL', () => {
        expect(reducer(undefined, {
            type: TOGGLE_PORTAL,
        })).toEqual(true);
    });
});
