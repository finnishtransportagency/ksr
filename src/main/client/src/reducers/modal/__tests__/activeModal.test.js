import * as types from '../../../constants/actionTypes';
import reducer from '../index';

describe('confirmModal reducer', () => {
    const initialState = {
        activeModal: '',
        data: null,
    };

    it('should return initial state', () => {
        expect(JSON.stringify(reducer(undefined, {}))).toEqual(JSON.stringify({
            activeModal: initialState,
        }));
    });

    it('should handle SET_ACTIVE_MODAL', () => {
        expect(JSON.stringify(reducer(undefined, {
            type: types.SET_ACTIVE_MODAL,
            activeModal: 'test',
            data: null,
        }))).toEqual(JSON.stringify({
            activeModal: {
                ...initialState,
                activeModal: 'test',
            },
        }));
    });
});
