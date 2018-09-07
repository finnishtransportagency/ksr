import { createWorkspaceJsonBody } from '../createWorkspaceJsonBody';

describe('createWorkspaceJsonBody', () => {
    it('creates correct data values without user or search layers', () => {
        const workspaceName = 'Test workspace';
        const layerList = [
            {
                id: '1',
                active: false,
                visible: true,
                opacity: 1,
                definitionExpression: '',
            }, {
                id: '2',
                active: true,
                visible: true,
                opacity: 0.4,
                definitionExpression: '',
            }];
        const selectedFeatures = [];
        const view = {
            scale: 20000,
            center: {
                x: 1700,
                y: 200,
            },
        };

        const expected = {
            name: 'Test workspace',
            scale: 20000,
            centerLongitude: 1700,
            centerLatitude: 200,
            layers: [
                {
                    layerId: 2,
                    userLayerId: null,
                    visible: '1',
                    opacity: 0.4,
                    layerOrder: 0,
                    definitionExpression: '',
                    selectedFeatures: [],
                },
            ],
        };

        const res = createWorkspaceJsonBody(workspaceName, layerList, view, selectedFeatures);

        expect(res).toEqual(expected);
    });

    it('creates correct data values with user layer', () => {
        const workspaceName = 'Test workspace';
        const layerList = [
            {
                id: '1',
                active: false,
                visible: true,
                opacity: 1,
                definitionExpression: '',
            }, {
                id: '10050',
                active: true,
                visible: true,
                opacity: 0.4,
                definitionExpression: '',
                userLayer: true,
            }];
        const selectedFeatures = [];
        const view = {
            scale: 20000,
            center: {
                x: 1700,
                y: 200,
            },
        };

        const expected = {
            name: 'Test workspace',
            scale: 20000,
            centerLongitude: 1700,
            centerLatitude: 200,
            layers: [
                {
                    layerId: null,
                    userLayerId: 10050,
                    visible: '1',
                    opacity: 0.4,
                    layerOrder: 0,
                    definitionExpression: '',
                    selectedFeatures: [],
                },
            ],
        };

        const res = createWorkspaceJsonBody(workspaceName, layerList, view, selectedFeatures);

        expect(res).toEqual(expected);
    });

    it('creates correct data values with search layer', () => {
        const workspaceName = 'Test workspace';
        const layerList = [
            {
                id: '1',
                active: false,
                visible: true,
                opacity: 1,
                definitionExpression: '',
            }, {
                id: '1.s',
                active: true,
                visible: true,
                opacity: 0.4,
                definitionExpression: 'test expression',
                userLayer: false,
            }];
        const selectedFeatures = [];
        const view = {
            scale: 20000,
            center: {
                x: 1700,
                y: 200,
            },
        };

        const expected = {
            name: 'Test workspace',
            scale: 20000,
            centerLongitude: 1700,
            centerLatitude: 200,
            layers: [
                {
                    layerId: 1,
                    userLayerId: null,
                    visible: '1',
                    opacity: 0.4,
                    layerOrder: 0,
                    definitionExpression: 'test expression',
                    selectedFeatures: [],
                },
            ],
        };

        const res = createWorkspaceJsonBody(workspaceName, layerList, view, selectedFeatures);

        expect(res).toEqual(expected);
    });

    it('creates correct data values with all different layer types and selected features', () => {
        const workspaceName = 'Test workspace';
        const layerList = [
            {
                id: '1',
                active: false,
                visible: true,
                opacity: 0.7,
                definitionExpression: '',
            }, {
                id: '2',
                active: true,
                visible: true,
                opacity: 0.6,
                definitionExpression: '',
            }, {
                id: '1.s',
                active: true,
                visible: true,
                opacity: 0.2,
                definitionExpression: 'test expression',
                userLayer: false,
            }, {
                id: '10050',
                active: true,
                visible: true,
                opacity: 1,
                definitionExpression: '',
                userLayer: true,
            }, {
                id: '10050',
                active: true,
                visible: true,
                opacity: 1,
                definitionExpression: '',
                userLayer: true,
                source: 'shapefile',
            }];
        const selectedFeatures = [
            { id: '2', data: [{ _id: 44, _selected: true }, { _id: 52, _selected: false }] },
            { id: '1.s', data: [{ _id: 480, _selected: true }] },
        ];
        const view = {
            scale: 20000,
            center: {
                x: 1700,
                y: 200,
            },
        };

        const expected = {
            name: 'Test workspace',
            scale: 20000,
            centerLongitude: 1700,
            centerLatitude: 200,
            layers: [
                {
                    layerId: 2,
                    userLayerId: null,
                    visible: '1',
                    opacity: 0.6,
                    layerOrder: 0,
                    definitionExpression: '',
                    selectedFeatures: [
                        {
                            id: 44,
                            highlight: '1',
                        },
                        {
                            id: 52,
                            highlight: '0',
                        },
                    ],
                }, {
                    layerId: 1,
                    userLayerId: null,
                    visible: '1',
                    opacity: 0.2,
                    layerOrder: 1,
                    definitionExpression: 'test expression',
                    selectedFeatures: [
                        {
                            id: 480,
                            highlight: '1',
                        },
                    ],
                }, {
                    layerId: null,
                    userLayerId: 10050,
                    visible: '1',
                    opacity: 1,
                    layerOrder: 2,
                    definitionExpression: '',
                    selectedFeatures: [],
                },
            ],
        };

        const res = createWorkspaceJsonBody(workspaceName, layerList, view, selectedFeatures);

        expect(res).toEqual(expected);
    });
});
