import * as types from '../../../constants/actionTypes';
import reducer from '../index';

describe('confirmModal reducer', () => {
    const initialState = {
        show: false,
        body: '',
        acceptText: '',
        cancelText: '',
        accept: () => {},
    };

    it('should return initial state', () => {
        expect(JSON.stringify(reducer(undefined, {}))).toEqual(JSON.stringify(initialState));
    });

    it('should handle SHOW_CONFIRM_MODAL', () => {
        const expectedResult = {
            show: true,
            body: 'Confirm text',
            acceptText: 'Accept',
            cancelText: 'Cancel',
            accept: () => {},
        };

        expect(JSON.stringify(reducer(undefined, {
            type: types.SHOW_CONFIRM_MODAL,
            body: 'Confirm text',
            acceptText: 'Accept',
            cancelText: 'Cancel',
            accept: () => {},
        }))).toEqual(JSON.stringify(expectedResult));
    });

    it('should handle HIDE_CONFIRM_MODAL', () => {
        expect(JSON.stringify(reducer(undefined, {
            type: types.HIDE_CONFIRM_MODAL,
        }))).toEqual(JSON.stringify(initialState));
    });
});
