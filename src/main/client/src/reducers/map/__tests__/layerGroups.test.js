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

    it('should handle GET_LAYER_GROUPS', () => {
        const initialState = {
            layerGroups: [],
            layerList: [],
            fetching: true,
        };

        expect(reducer(undefined, {
            type: types.GET_LAYER_GROUPS,
        })).toEqual(initialState);
    });

    it('should handle GET_LAYER_GROUPS_FULFILLED', () => {
        const result = {
            layerGroups: [
                {
                    id: 1,
                    layers: [
                        {
                            id: 3,
                            name: 'mapLayer',
                        },
                    ],
                },
            ],
            layerList: [
                {
                    id: 3,
                    name: 'mapLayer',
                },
            ],
            fetching: false,
        };

        expect(reducer(undefined, {
            type: types.GET_LAYER_GROUPS_FULFILLED,
            layerGroups: result.layerGroups,
            layerList: result.layerList,
        })).toEqual(result);
    });
});
