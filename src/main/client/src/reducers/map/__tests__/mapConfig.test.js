import * as types from '../../../constants/actionTypes';
import reducer from '../mapConfig';

describe('Map config reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 0,
            fetching: true,
            printServiceUrl: null,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_MAP_CONFIG', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 0,
            fetching: true,
            printServiceUrl: null,
        };

        expect(reducer(undefined, {
            type: types.GET_MAP_CONFIG,
        })).toEqual(initialState);
    });

    it('should handle GET_MAP_CONFIG_FULFILLED', () => {
        const expectedResult = {
            mapCenter: [425574, 7051264],
            mapScale: 9244648,
            printServiceUrl: '/print/service/url',
            fetching: false,
        };

        expect(reducer(undefined, {
            type: types.GET_MAP_CONFIG_FULFILLED,
            mapCenter: expectedResult.mapCenter,
            mapScale: expectedResult.mapScale,
            printServiceUrl: expectedResult.printServiceUrl,
        })).toEqual(expectedResult);
    });
});
