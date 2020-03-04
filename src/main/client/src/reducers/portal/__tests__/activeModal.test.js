import * as types from '../../../constants/actionTypes';
import reducer from '../index';

describe('portal reducer', () => {
    const initialState = {
        activePortal: '',
    };

    it('should return initial state', () => {
        expect(JSON.stringify(reducer(undefined, {}))).toEqual(JSON.stringify({
            activePortal: initialState,
        }));
    });

    it('should handle SET_ACTIVE_PORTAL', () => {
        expect(JSON.stringify(reducer(undefined, {
            type: types.SET_ACTIVE_PORTAL,
            activePortal: 'test',
        }))).toEqual(JSON.stringify({
            activePortal: {
                ...initialState,
                activePortal: 'test',
            },
        }));
    });
});
