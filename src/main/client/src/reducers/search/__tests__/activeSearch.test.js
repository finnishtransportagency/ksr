import * as types from '../../../constants/actionTypes';
import reducer from '../activeSearch';

const initialState = 'layer';

describe('Active search reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle SET_ACTIVE_SEARCH', () => {
        const action = {
            activeSearch: 'property',
        };

        expect(reducer(undefined, {
            type: types.SET_ACTIVE_SEARCH,
            activeSearch: action.activeSearch,
        })).toEqual(action.activeSearch);
    });

    it('should handle SET_PROPERTY_INFO', () => {
        expect(reducer(undefined, {
            type: types.SET_PROPERTY_INFO,
        })).toEqual('property');
    });
});
