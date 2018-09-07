import * as types from '../../../constants/actionTypes';
import reducer from '../index';

describe('confirmModal reducer', () => {
    const initialState = {
        layerId: '',
        geometryType: '',
    };

    it('should return initial state', () => {
        expect(JSON.stringify(reducer(undefined, {}))).toEqual(JSON.stringify({
            active: initialState,
        }));
    });

    it('should handle SET_ACTIVE_ADMIN_TOOL', () => {
        expect(JSON.stringify(reducer(undefined, {
            type: types.SET_ACTIVE_ADMIN_TOOL,
            layerId: '1',
            layerList: [{ id: '1', geometryType: 'polygon' }, { id: '2', geometryType: 'line' }],
        }))).toEqual(JSON.stringify({
            active: {
                layerId: '1',
                geometryType: 'polygon',
            },
        }));
    });
});
