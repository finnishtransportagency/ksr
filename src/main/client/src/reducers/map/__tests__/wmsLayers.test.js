import * as types from '../../../constants/actionTypes';
import { mockWmsLayers } from '../../../mock-data/wmsLayers';
import reducer from '../wmsLayers';

describe('map reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(mockWmsLayers);
    });

    it('should handle GET_WMS_LAYERS', () => {
        expect(reducer(undefined, {
            type: types.GET_WMS_LAYERS,
        })).toEqual(mockWmsLayers);
    });

    it('should handle SET_WMS_LAYERS', () => {
        expect(reducer(undefined, {
            type: types.SET_ACTIVE_NAV,
        })).toEqual(mockWmsLayers);
    });
});
