import {
    getWorkspaceFeatures, queryWorkspaceFeatures, updateLayerList, searchQueryMap,
} from '../loadWorkspace';

describe('loadWorkspace', () => {
    it('getWorkspaceFeatures - should return workspace features', () => {
        const workspace = [
            {
                layerId: '123',
                selectedFeaturesList: [
                    { id: 1, highlight: false },
                    { id: 2, highlight: true },
                ],
            },
            {
                layerId: '456',
                selectedFeaturesList: [
                    { id: 7, highlight: true },
                    { id: 8, highlight: false },
                ],
            },
        ];

        const expectedResult = [
            { featureId: 1, layerId: '123', selected: false },
            { featureId: 2, layerId: '123', selected: true },
            { featureId: 7, layerId: '456', selected: true },
            { featureId: 8, layerId: '456', selected: false },
        ];

        expect(getWorkspaceFeatures(workspace)).toEqual(expectedResult);
    });

    it('queryWorkspaceFeatures - should return layers on resolved promise', () => {
        const workspaceFeatures = [
            { featureId: 1, layerId: '123', selected: false },
            { featureId: 2, layerId: '123', selected: true },
            { featureId: 7, layerId: '456', selected: true },
            { featureId: 8, layerId: '456', selected: false },
        ];

        const query = {
            objectIds: [1, 2],
        };

        const results = {
            features: [
                {
                    attributes: { OBJECTID_1: 1 },
                    selected: true,
                },
            ],
        };

        const view = {
            map: {
                layers: [
                    {
                        queryFeatures: jest.fn(query)
                            .mockImplementation(() => new Promise((resolve) => {
                                resolve(results);
                            })),
                        objectIdField: 'OBJECTID_1',
                        id: '123',
                        title: 'test',
                        fields: [],
                    },
                ],
            },
        };

        const expectedResult = {
            layers: [{
                features: [
                    {
                        attributes: { OBJECTID_1: 1 },
                        selected: false,
                    },
                ],
                fields: [],
                id: '123',
                objectIdFieldName: 'OBJECTID_1',
                _source: 'select',
                title: 'test',
            }],
        };

        return expect(queryWorkspaceFeatures(workspaceFeatures, view))
            .resolves.toEqual(expectedResult);
    });

    it('updateLayerList - should return updated layer list with workspace settings', () => {
        const workspace = {
            name: 'Test Workspace',
            layers: [
                {
                    layerId: '456',
                    opacity: 0.2,
                    layerOrder: 1,
                    visible: false,
                },
                {
                    layerId: '789',
                    opacity: 0.6,
                    layerOrder: 0,
                    visible: true,
                },
                {
                    userLayerId: '10789',
                    opacity: 0.3,
                    layerOrder: 2,
                    visible: false,
                },
                {
                    layerId: '123',
                    opacity: 1,
                    layerOrder: 3,
                    visible: true,
                    definitionExpression: 'Search query',
                    _source: 'search',
                },
            ],
        };

        const layerList = [
            {
                id: '123',
                active: true,
                visible: true,
                opacity: 1,
                layerOrder: 6,
            },
            {
                id: '456',
                active: false,
                visible: true,
                opacity: 0.2,
                layerOrder: 7,
            },
            {
                id: '789',
                active: true,
                visible: false,
                opacity: 0.5,
                layerOrder: 18,
            },
            {
                id: '10789',
                opacity: 0.3,
                layerOrder: 2,
                visible: false,
            },
            {
                id: '123.s',
                opacity: 0.3,
                layerOrder: 2,
                visible: false,
                definitionExpression: 'Search query',
                _source: 'search',
            },
        ];

        const expectedResult = [
            {
                id: '789',
                visible: false,
                active: false,
                opacity: 0.6,
                layerOrder: 0,
            },
            {
                id: '456',
                visible: false,
                active: false,
                opacity: 0.2,
                layerOrder: 1,
            },
            {
                id: '10789',
                visible: false,
                active: false,
                opacity: 0.3,
                layerOrder: 2,
            },
            {
                id: '123.s',
                visible: false,
                active: false,
                opacity: 1,
                layerOrder: 3,
                definitionExpression: 'Search query',
                _source: 'search',
            },
            {
                id: '123',
                active: false,
                visible: false,
                opacity: 1,
                layerOrder: 6,
            },
        ];

        expect(updateLayerList(workspace, layerList)).toEqual(expectedResult);
    });

    it('searchQueryMap - should return map with layers and query strings', () => {
        const workspace = {
            name: 'Test Workspace',
            layers: [
                {
                    layerId: '456',
                    opacity: 0.2,
                    layerOrder: 1,
                    visible: false,
                },
                {
                    layerId: '123',
                    opacity: 1,
                    layerOrder: 3,
                    visible: true,
                    definitionExpression: 'Search query',
                },
            ],
        };

        const layerList = [
            {
                id: '123',
                active: true,
                visible: true,
                opacity: 1,
                layerOrder: 6,
            },
            {
                id: '456',
                active: false,
                visible: true,
                opacity: 0.2,
                layerOrder: 7,
            },
            {
                id: '789',
                active: true,
                visible: false,
                opacity: 0.5,
                layerOrder: 18,
            },
            {
                id: '10789',
                opacity: 0.3,
                layerOrder: 2,
                visible: false,
            },
            {
                id: '123.s',
                opacity: 0.3,
                layerOrder: 2,
                visible: false,
                definitionExpression: 'Search query',
            },
        ];

        const expectedQueryMap = new Map();
        expectedQueryMap.set(
            {
                layerId: '123',
                opacity: 1,
                layerOrder: 3,
                visible: true,
                definitionExpression: 'Search query',
                layer: {
                    id: '123.s',
                    layerOrder: 2,
                    opacity: 0.3,
                    visible: false,
                    definitionExpression: 'Search query',
                },
            },
            'Search query',
        );

        expect(searchQueryMap(workspace, layerList)).toEqual(expectedQueryMap);
    });
});
