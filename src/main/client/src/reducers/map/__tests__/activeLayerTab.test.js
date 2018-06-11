import * as types from '../../../constants/actionTypes';
import reducer from '../activeLayerTab';

describe('Layer group reducer', () => {
    it('should return initial state', () => {
        const initialState = 'active';

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_ACTIVE_LAYER_TAB', () => {
        const initialState = 'active';

        expect(reducer(undefined, {
            type: types.GET_ACTIVE_LAYER_TAB,
        })).toEqual(initialState);
    });

    it('should handle SET_ACTIVE_LAYER_TAB', () => {
        const newState = 'all';

        expect(reducer(undefined, {
            type: types.SET_ACTIVE_LAYER_TAB,
            tab: 'all',
        })).toEqual(newState);
    });
});
