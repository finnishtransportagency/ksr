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

    it('should handle REMOVE_USER_LAYER_FULFILLED', () => {
        const initialState = {
            layerGroups: [
                {
                    id: 1,
                    name: 'Group 1',
                    layers: [
                        {
                            id: '123',
                            name: 'Layer 1',
                            type: 'wms',
                            url: '/api/proxy/layer/123',
                            layers: 'layer1',
                            styles: 'default',
                            visible: false,
                            opacity: 1,
                            authentication: null,
                            layerOrder: 42,
                            minScale: 0,
                            maxScale: 0,
                            transparent: true,
                            attribution: 'Attribution 1',
                            queryable: false,
                            queryColumns: null,
                            userLayer: false,
                        },
                    ],
                    type: 'wms',
                    groupOrder: 1,
                },
                {
                    id: 2,
                    name: 'Group 2',
                    layers: [
                        {
                            id: '223',
                            name: 'Layer 2',
                            type: 'wms',
                            url: '/api/proxy/layer/223',
                            layers: 'layer2',
                            styles: 'default',
                            visible: false,
                            opacity: 1,
                            authentication: null,
                            layerOrder: 42,
                            minScale: 0,
                            maxScale: 0,
                            transparent: true,
                            attribution: 'Attribution 2',
                            queryable: false,
                            queryColumns: null,
                            userLayer: false,
                        },
                    ],
                    type: 'wms',
                    groupOrder: 2,
                },
            ],
            layerList: [
                {
                    active: true,
                    attribution: 'Attribution 1',
                    authentication: null,
                    geometryType: null,
                    fields: [],
                    id: '123',
                    layerOrder: 12,
                    layers: 'layer1',
                    maxScale: 123,
                    minScale: 321,
                    name: 'Layer 1',
                    opacity: 0.5,
                    queryColumns: [],
                    queryable: false,
                    styles: '',
                    transparent: false,
                    type: 'wms',
                    url: '/api/proxy/layer/123',
                    visible: true,
                    _source: '',
                },
                {
                    active: true,
                    attribution: 'Attribution 2',
                    authentication: null,
                    geometryType: null,
                    fields: [],
                    id: '223',
                    layerOrder: 12,
                    layers: 'layer2',
                    maxScale: 123,
                    minScale: 321,
                    name: 'Layer 2',
                    opacity: 0.5,
                    queryColumns: [],
                    queryable: false,
                    styles: '',
                    transparent: false,
                    type: 'wms',
                    url: '/api/proxy/layer/223',
                    visible: true,
                    _source: '',
                },
            ],
            fetching: false,
        };

        const action = {
            type: types.REMOVE_USER_LAYER_FULFILLED,
            layerId: '223',
        };

        const expected = {
            layerGroups: [
                {
                    id: 1,
                    name: 'Group 1',
                    layers: [
                        {
                            id: '123',
                            name: 'Layer 1',
                            type: 'wms',
                            url: '/api/proxy/layer/123',
                            layers: 'layer1',
                            styles: 'default',
                            visible: false,
                            opacity: 1,
                            authentication: null,
                            layerOrder: 42,
                            minScale: 0,
                            maxScale: 0,
                            transparent: true,
                            attribution: 'Attribution 1',
                            queryable: false,
                            queryColumns: null,
                            userLayer: false,
                        },
                    ],
                    type: 'wms',
                    groupOrder: 1,
                },
                {
                    id: 2,
                    name: 'Group 2',
                    layers: [],
                    type: 'wms',
                    groupOrder: 2,
                },
            ],
            layerList: [
                {
                    active: true,
                    attribution: 'Attribution 1',
                    authentication: null,
                    geometryType: null,
                    fields: [],
                    id: '123',
                    layerOrder: 12,
                    layers: 'layer1',
                    maxScale: 123,
                    minScale: 321,
                    name: 'Layer 1',
                    opacity: 0.5,
                    queryColumns: [],
                    queryable: false,
                    styles: '',
                    transparent: false,
                    type: 'wms',
                    url: '/api/proxy/layer/123',
                    visible: true,
                    _source: '',
                },
            ],
            fetching: false,
        };

        expect(reducer(initialState, action)).toEqual(expected);
    });
});
