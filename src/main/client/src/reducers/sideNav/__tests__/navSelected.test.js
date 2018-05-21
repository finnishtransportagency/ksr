import * as types from '../../../constants/action-types';
import reducer from '../navigation';

describe('navigation reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            active: '',
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_ACTIVE_NAV', () => {
        const expectedResult = {
            active: 'mapLayers',
        };

        reducer(undefined, {
            type: types.SET_ACTIVE_NAV,
            payload: 'mapLayers',
        });

        expect(reducer(undefined, {
            type: types.GET_ACTIVE_NAV,
            payload: 'mapLayers',
        })).toEqual(expectedResult);
    });

    it('should handle SET_ACTIVE_NAV', () => {
        const expectedResult = {
            active: 'fileExport',
        };

        expect(reducer(undefined, {
            type: types.SET_ACTIVE_NAV,
            payload: 'fileExport',
        })).toEqual(expectedResult);
    });
});
