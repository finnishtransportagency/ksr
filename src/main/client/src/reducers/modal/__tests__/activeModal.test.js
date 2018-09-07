import * as types from '../../../constants/actionTypes';
import reducer from '../index';

describe('confirmModal reducer', () => {
    const initialState = {
        activeModal: '',
        dropzone: false,
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
        }))).toEqual(JSON.stringify({
            activeModal: {
                ...initialState,
                activeModal: 'test',
            },
        }));
    });

    it('should handle SET_DROPZONE_ACTIVE', () => {
        expect(JSON.stringify(reducer(undefined, {
            type: types.SET_DROPZONE_ACTIVE,
        }))).toEqual(JSON.stringify({
            activeModal: {
                ...initialState,
                dropzone: !initialState.dropzone,
            },
        }));
    });
});
