import * as types from '../../../constants/actionTypes';
import reducer from '../layerGroups';
import store from '../../../store';

jest.mock('../../../store');

describe('Layer group reducer', () => {
    it('should return initial state', () => {
        const initialState = {
            layerGroups: [],
            layerList: [],
            fetching: true,
            layersVisibleZoomOut: [],
        };

        expect(reducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should handle GET_LAYER_GROUPS', () => {
        const initialState = {
            layerGroups: [],
            layerList: [],
            fetching: true,
            layersVisibleZoomOut: [],
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
                            queryColumnsList: null,
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
                            queryColumnsList: null,
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
                    queryColumnsList: [],
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
                    queryColumnsList: [],
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
                            queryColumnsList: null,
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
                    queryColumnsList: [],
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

    it('should handle SET_WORKSPACE_FULFILLED', () => {
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
                            queryColumnsList: null,
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
                    name: 'Postinumeroalueet',
                    url: '/api/proxy/layer/81/',
                    layers: 'pno',
                    styles: 'default',
                    attribution: 'Esri',
                    id: '81',
                    type: 'agfs',
                    visible: false,
                    opacity: 0.1,
                    authentication: null,
                    layerOrder: 10,
                    minScale: 577790,
                    maxScale: 9027,
                    transparent: false,
                    desktopVisible: true,
                    mobileVisible: true,
                    queryable: true,
                    queryColumnsList: [
                        'posti_alue',
                        'nimi',
                        'namn',
                        'kunta',
                        'kuntanro',
                    ],
                    userLayer: false,
                    active: false,
                    geometryType: 'esriGeometryPolygon',
                    fields: [
                        {
                            value: 0,
                            label: 'OBJECTID_1',
                            type: 'esriFieldTypeOID',
                            name: 'OBJECTID_1',
                        },
                        {
                            value: 1,
                            label: 'gml_id',
                            type: 'esriFieldTypeString',
                            name: 'gml_id',
                        },
                        {
                            value: 2,
                            label: 'objectid',
                            type: 'esriFieldTypeInteger',
                            name: 'objectid',
                        },
                        {
                            value: 3,
                            label: 'posti_alue',
                            type: 'esriFieldTypeString',
                            name: 'posti_alue',
                        },
                        {
                            value: 4,
                            label: 'nimi',
                            type: 'esriFieldTypeString',
                            name: 'nimi',
                        },
                        {
                            value: 5,
                            label: 'namn',
                            type: 'esriFieldTypeString',
                            name: 'namn',
                        },
                        {
                            value: 6,
                            label: 'kunta',
                            type: 'esriFieldTypeString',
                            name: 'kunta',
                        },
                        {
                            value: 7,
                            label: 'kuntanro',
                            type: 'esriFieldTypeInteger',
                            name: 'kuntanro',
                        },
                        {
                            value: 8,
                            label: 'vuosi',
                            type: 'esriFieldTypeInteger',
                            name: 'vuosi',
                        },
                        {
                            value: 9,
                            label: 'pinta_ala',
                            type: 'esriFieldTypeDouble',
                            name: 'pinta_ala',
                        },
                        {
                            value: 10,
                            label: 'shape_leng',
                            type: 'esriFieldTypeDouble',
                            name: 'shape_leng',
                        },
                        {
                            value: 11,
                            label: 'Shape__Area',
                            type: 'esriFieldTypeDouble',
                            name: 'Shape__Area',
                        },
                        {
                            value: 12,
                            label: 'Shape__Length',
                            type: 'esriFieldTypeDouble',
                            name: 'Shape__Length',
                        },
                    ],
                    definitionExpression: null,
                },
                {
                    name: 'Taustakartta',
                    url: '/api/proxy/layer/25/',
                    layers: 'taustakartta',
                    styles: 'default',
                    attribution: 'Maanmittauslaitos',
                    id: '25',
                    type: 'wmts',
                    visible: false,
                    opacity: 1,
                    authentication: null,
                    layerOrder: 3,
                    minScale: 18489297,
                    maxScale: 1128,
                    transparent: false,
                    desktopVisible: true,
                    mobileVisible: true,
                    queryable: false,
                    queryColumnsList: null,
                    userLayer: false,
                    active: false,
                    definitionExpression: null,
                },
            ],
            fetching: false,
        };

        const action = {
            type: types.SET_WORKSPACE_FULFILLED,
            workspace: {
                name: 'lohja',
                id: 143,
                scale: 352008,
                centerLongitude: 347972,
                centerLatitude: 6679428,
                updateTime: '2018-09-19T10:15:51.494+0000',
                layers: [
                    {
                        layerId: '25',
                        userLayerId: null,
                        definitionExpression: null,
                        visible: true,
                        opacity: 0.7,
                        layerOrder: 1,
                        selectedFeaturesList: [],
                    },
                    {
                        layerId: '81',
                        userLayerId: null,
                        definitionExpression: null,
                        visible: true,
                        opacity: 0.4,
                        layerOrder: 2,
                        selectedFeaturesList: [
                            {
                                id: '2549',
                                highlight: false,
                            },
                            {
                                id: '2550',
                                highlight: true,
                            },
                            {
                                id: '2776',
                                highlight: true,
                            },
                        ],
                    },
                ],
            },
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
                            queryColumnsList: null,
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
                    name: 'Taustakartta',
                    url: '/api/proxy/layer/25/',
                    layers: 'taustakartta',
                    styles: 'default',
                    attribution: 'Maanmittauslaitos',
                    id: '25',
                    type: 'wmts',
                    visible: false,
                    opacity: 0.7,
                    authentication: null,
                    layerOrder: 1,
                    minScale: 18489297,
                    maxScale: 1128,
                    transparent: false,
                    desktopVisible: true,
                    mobileVisible: true,
                    queryable: false,
                    queryColumnsList: null,
                    userLayer: false,
                    active: false,
                    definitionExpression: null,
                },
                {
                    name: 'Postinumeroalueet',
                    url: '/api/proxy/layer/81/',
                    layers: 'pno',
                    styles: 'default',
                    attribution: 'Esri',
                    id: '81',
                    type: 'agfs',
                    visible: false,
                    opacity: 0.4,
                    authentication: null,
                    layerOrder: 2,
                    minScale: 577790,
                    maxScale: 9027,
                    transparent: false,
                    desktopVisible: true,
                    mobileVisible: true,
                    queryable: true,
                    queryColumnsList: [
                        'posti_alue',
                        'nimi',
                        'namn',
                        'kunta',
                        'kuntanro',
                    ],
                    userLayer: false,
                    active: false,
                    geometryType: 'esriGeometryPolygon',
                    fields: [
                        {
                            value: 0,
                            label: 'OBJECTID_1',
                            type: 'esriFieldTypeOID',
                            name: 'OBJECTID_1',
                        },
                        {
                            value: 1,
                            label: 'gml_id',
                            type: 'esriFieldTypeString',
                            name: 'gml_id',
                        },
                        {
                            value: 2,
                            label: 'objectid',
                            type: 'esriFieldTypeInteger',
                            name: 'objectid',
                        },
                        {
                            value: 3,
                            label: 'posti_alue',
                            type: 'esriFieldTypeString',
                            name: 'posti_alue',
                        },
                        {
                            value: 4,
                            label: 'nimi',
                            type: 'esriFieldTypeString',
                            name: 'nimi',
                        },
                        {
                            value: 5,
                            label: 'namn',
                            type: 'esriFieldTypeString',
                            name: 'namn',
                        },
                        {
                            value: 6,
                            label: 'kunta',
                            type: 'esriFieldTypeString',
                            name: 'kunta',
                        },
                        {
                            value: 7,
                            label: 'kuntanro',
                            type: 'esriFieldTypeInteger',
                            name: 'kuntanro',
                        },
                        {
                            value: 8,
                            label: 'vuosi',
                            type: 'esriFieldTypeInteger',
                            name: 'vuosi',
                        },
                        {
                            value: 9,
                            label: 'pinta_ala',
                            type: 'esriFieldTypeDouble',
                            name: 'pinta_ala',
                        },
                        {
                            value: 10,
                            label: 'shape_leng',
                            type: 'esriFieldTypeDouble',
                            name: 'shape_leng',
                        },
                        {
                            value: 11,
                            label: 'Shape__Area',
                            type: 'esriFieldTypeDouble',
                            name: 'Shape__Area',
                        },
                        {
                            value: 12,
                            label: 'Shape__Length',
                            type: 'esriFieldTypeDouble',
                            name: 'Shape__Length',
                        },
                    ],
                    definitionExpression: null,
                },
            ],
            fetching: false,
        };

        expect(reducer(initialState, action)).toEqual(expected);
    });
});
