import * as types from '../../../constants/actionTypes';
import reducer from '../contractList';

describe('contractList reducer', () => {
    const initialState = {
        layerId: null,
        objectId: null,
    };

    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('SET_CONTRACT_LIST_INFO', () => {
        expect(reducer(undefined, {
            type: types.SET_CONTRACT_LIST_INFO,
            layerId: 123,
            objectId: 456,
        })).toEqual({
            layerId: 123,
            objectId: 456,
        });
    });

    it('REMOVE_CONTRACT_LIST_INFO', () => {
        expect(reducer(undefined, {
            type: types.REMOVE_CONTRACT_LIST_INFO,
        })).toEqual(initialState);
    });
});
