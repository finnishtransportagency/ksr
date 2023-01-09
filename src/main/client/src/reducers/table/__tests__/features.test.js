import featureReducer from '../features';

describe.skip('reducers - table - features', () => {
    it('should SET_ACTIVE_TABLE', () => {
        const action = {
            type: 'SET_ACTIVE_TABLE',
            activeTable: 'a1b2',
        };

        const initialState = {
            layers: [],
            editedLayers: [],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        const expected = {
            layers: [],
            editedLayers: [],
            activeTable: 'a1b2',
            fetching: false,
            singleLayerGeometry: {},
        };

        expect(featureReducer(initialState, action)).toMatchObject(expected);
    });

    it('should SET_ACTIVE_ADMIN_TOOL - one agfl-layer', () => {
        const action = {
            type: 'SET_ACTIVE_ADMIN_TOOL',
            layerId: '123',
        };

        const initialState = {
            layers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            editedLayers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        const expected = {
            layers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            editedLayers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        expect(featureReducer(initialState, action)).toMatchObject(expected);
    });

    it('should SET_ACTIVE_ADMIN_TOOL - multiple agfl-layers', () => {
        const action = {
            type: 'SET_ACTIVE_ADMIN_TOOL',
            layerId: '123',
        };

        const initialState = {
            layers: [
                {
                    id: '12',
                    type: 'agfl',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            editedLayers: [
                {
                    id: '12',
                    type: 'agfl',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        const expected = {
            layers: [
                {
                    id: '12',
                    type: 'agfl',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            editedLayers: [
                {
                    id: '12',
                    type: 'agfl',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        expect(featureReducer(initialState, action)).toMatchObject(expected);
    });

    it('should SET_ACTIVE_ADMIN_TOOL - no agfl-layers', () => {
        const action = {
            type: 'SET_ACTIVE_ADMIN_TOOL',
            layerId: '12',
        };

        const initialState = {
            layers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            editedLayers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        const expected = {
            layers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            editedLayers: [
                {
                    id: '12',
                    type: 'agfs',
                },
                {
                    id: '123',
                    type: 'agfl',
                },
            ],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        expect(featureReducer(initialState, action)).toMatchObject(expected);
    });

    it('should CLEAR_TABLE_DATA', () => {
        const action = { type: 'CLEAR_TABLE_DATA' };

        const initialState = {
            layers: [],
            editedLayers: [],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        const expected = {
            layers: [],
            editedLayers: [],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        expect(featureReducer(initialState, action)).toMatchObject(expected);
    });

    it('should SET_SINGLE_LAYER_GEOMETRY', () => {
        const action = { type: 'SET_SINGLE_LAYER_GEOMETRY', geometry: 123 };

        const initialState = {
            layers: [],
            editedLayers: [],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        const expected = {
            layers: [],
            editedLayers: [],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: 123,
        };

        expect(featureReducer(initialState, action)).toMatchObject(expected);
    });

    it('should return state', () => {
        const initialState = {
            layers: [],
            editedLayers: [],
            activeTable: '',
            fetching: false,
            singleLayerGeometry: {},
        };

        expect(featureReducer(initialState, {})).toMatchObject(initialState);
        expect(featureReducer(undefined, {})).toMatchObject(initialState);
    });
});
