import * as types from '../../../constants/actionTypes';
import reducer from '../layerGroups';

describe('Layer group reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            layerGroups: [],
            layerList: [],
            fetching: true,
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle GET_GROUP_LAYERS', () => {
        const initialState = {
            layerGroups: [],
            layerList: [],
            fetching: true,
        };

        expect(reducer(undefined, {
            type: types.GET_GROUP_LAYERS,
        })).toEqual(initialState);
    });

    it('should handle GET_GROUP_LAYERS_FULFILLED', () => {
        const initialState = {
            layerGroups: [],
            layerList: [],
            fetching: true,
        };

        expect(reducer(undefined, {
            type: types.GET_GROUP_LAYERS,
        })).toEqual(initialState);
    });
});
