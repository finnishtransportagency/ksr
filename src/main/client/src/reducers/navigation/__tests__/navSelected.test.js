import * as types from '../../../constants/actionTypes';
import reducer from '../activeNav';

describe('navigation reducer', () => {
    it('should return initial state', () => {
        const initialState = '';

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_ACTIVE_NAV', () => {
        expect(reducer(undefined, {
            type: types.GET_ACTIVE_NAV,
            selectedNav: 'mapLayers',
        })).toEqual('');
    });

    it('should handle SET_ACTIVE_NAV', () => {
        expect(reducer(undefined, {
            type: types.SET_ACTIVE_NAV,
            selectedNav: 'fileExport',
        })).toEqual('fileExport');

        expect(reducer(undefined, {
            type: types.SET_ACTIVE_NAV,
            selectedNav: 'fileExport',
        })).not.toEqual('mapLayers');
    });
});
