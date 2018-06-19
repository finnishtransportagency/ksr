import * as types from '../../../constants/actionTypes';
import reducer from '../mapConfig';

describe('Map config reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 0,
            fetching: true,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_MAP_CONFIG', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 0,
            fetching: true,
        };

        expect(reducer(undefined, {
            type: types.GET_MAP_CONFIG,
        })).toEqual(initialState);
    });

    it('should handle GET_MAP_CONFIG_FULFILLED', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 0,
            fetching: true,
        };

        expect(reducer(undefined, {
            type: types.GET_MAP_CONFIG,
        })).toEqual(initialState);
    });
});
