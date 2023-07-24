import * as types from '../../../constants/actionTypes';
import reducer from '../mapConfig';

describe('Map config reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 0,
            fetching: true,
            printServiceUrl: null,
            extractServiceUrl: null,
            searchApiKey: null,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_MAP_CONFIG', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 0,
            fetching: true,
            printServiceUrl: null,
            extractServiceUrl: null,
            searchApiKey: null,
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
            extractServiceUrl: '/extract/service/url',
            fetching: false,
        };

        expect(reducer(undefined, {
            type: types.GET_MAP_CONFIG_FULFILLED,
            mapCenter: expectedResult.mapCenter,
            mapScale: expectedResult.mapScale,
            printServiceUrl: expectedResult.printServiceUrl,
            extractServiceUrl: expectedResult.extractServiceUrl,
        })).toEqual(expectedResult);
    });

    it('should handle SET_SCALE if scale has changed', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 5000,
            printServiceUrl: null,
            extractServiceUrl: null,
            fetching: false,
        };

        const expectedResult = {
            ...initialState,
            mapScale: 10000,
        };

        const action = {
            type: types.SET_SCALE,
            mapScale: 10000,
        };

        expect(reducer(initialState, action)).toEqual(expectedResult);
    });

    it('should return current state in SET_SCALE if scale has not changed', () => {
        const initialState = {
            mapCenter: [],
            mapScale: 5000,
            printServiceUrl: null,
            extractServiceUrl: null,
            fetching: false,
        };

        const action = {
            type: types.SET_SCALE,
            mapScale: 5000,
        };

        // expect().toBe because we wan't to compare object references
        // instead of object content
        expect(reducer(initialState, action)).toBe(initialState);
    });
});
