import * as types from '../../../constants/actionTypes';
import { mockWmtsLayers } from '../../../mock-data/wmtsLayers';
import reducer from '../wmtsLayers';

describe('WMTS Layers reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(mockWmtsLayers);
    });

    it('should handle GET_WMTS_LAYERS', () => {
        expect(reducer(undefined, {
            type: types.GET_WMTS_LAYERS,
        })).toEqual(mockWmtsLayers);
    });

    it('should handle SET_WMTS_LAYERS', () => {
        expect(reducer(undefined, {
            type: types.SET_WMTS_LAYERS,
        })).toEqual(mockWmtsLayers);
    });
});
