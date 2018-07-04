import { 
    mergeData,
    updateLayerColumns,
    parseColumns,
    mergeLayers,
    parseData,
    getActiveTable,
    syncWithLayersList,
    deSelectFeatures,
    toggleSelection,
} from '../parseFeatureData';

describe('parseFeatureData', () => {
    it('mergeData - it should merge features', () => {
        const a = [
            {
                n: 1,
                _id: 'a',
                _selected: true,
                _source: 'select',
            },
            {
                n: 2,
                _id: 'b',
                _selected: false,
                _source: 'search',
            },
            {
                n: 3,
                _id: 'c',
                _selected: false,
                _source: 'search',
            },
            {
                n: 4,
                _id: 'd',
                _selected: true,
                _source: 'search',
            },
        ];

        const b = [
            {
                n: 2,
                _id: 'b',
                _selected: true,
                _source: 'select',
            },
            {
                n: 4,
                _id: 'd',
                _selected: true,
                _source: 'select',
            },
            {
                n: 5,
                _id: 'e',
                _selected: true,
                _source: 'select',
            },
            {
                n: 6,
                _id: 'f',
                _selected: true,
                _source: 'select',
            },
        ];

        const data = mergeData(a, b);

        expect(data.length).toBe(5);
        expect(data.filter(o => o._selected).length).toBe(4);
    });

    it('updateColumns - should update layer columns', () => {
        const activeTable = '5678';
        const currentLayers = [
            {
                id: '1234',
                columns: [1, 2, 3, 4],
            },
            {
                id: '5678',
                columns: [5, 6, 7, 8],
            },
        ];

        const columns = [5, 8];
        const layers = updateLayerColumns(activeTable, columns, currentLayers);

        expect(layers.find(l => l.id === activeTable).columns).toEqual([...columns]);
    });

    it('parseColumns - should parse columns', () => {
        const a = [
            {
                alias: 'L 1 A',
                name: 'l.1.a',
            },
            {
                alias: 'L 2 A',
                name: 'l.2.a',
            },
            {
                alias: 'L 3 A',
                name: 'l.3.a',
            },
        ];

        const aExpected = [
            {
                Header: 'L 1 A',
                accessor: 'l.1.a',
                show: true,
            },
            {
                Header: 'L 2 A',
                accessor: 'l.2.a',
                show: true,
            },
            {
                Header: 'L 3 A',
                accessor: 'l.3.a',
                show: true,
            },
        ];

        expect(parseColumns(null)).toEqual([]);
        expect(parseColumns(undefined)).toEqual([]);
        expect(parseColumns(a)).toEqual(aExpected);
    });

    it('mergeLayers - should merge layers', () => {
        const currentLayers = [
            {
                id: '123',
                data: [{ _id: 'a123', _source: 'search', _selected: false }],
            },
            {
                id: '456',
                data: [{ _id: 'a456', _source: 'select', _selected: true }],
            },
            {
                id: '789',
                data: [{ _id: 'a789', _source: 'search', _selected: true }],
            },
        ];

        const newLayers = [
            {
                id: '123',
                data: [{ _id: 'a123', _source: 'search', _selected: true }],
            },
            {
                id: '111',
                data: [{ _id: 'b456', _source: 'select', _selected: true }],
            },
            {
                id: '789',
                data: [{ _id: 'a789', _source: 'search', _selected: false }],
            },
        ];

        const expectedLayers = [
            {
                id: '123',
                data: [{ _id: 'a123', _source: 'search', _selected: true }],
            },
            {
                id: '111',
                data: [{ _id: 'b456', _source: 'select', _selected: true }],
            },
            {
                id: '789',
                data: [{ _id: 'a789', _source: 'search', _selected: false }],
            },
        ];

        const { layers, activeTable } = mergeLayers(currentLayers, newLayers, '456');

        expect(activeTable).toBe('123');
        expect(layers).toEqual(expect.arrayContaining(expectedLayers));
    });

    it('parseData - should parse data', () => {
        const data = {
            layers: [
                {
                    id: '123',
                    objectIdFieldName: 'id',
                    title: 'layer123',
                    fields: [{ alias: 'L1A', name: 'l.1.a' }, { alias: 'L2A', name: 'l.2.a' }],
                    features: [{ attributes: { id: 'a123', name: 'f1' } }],
                },
                {
                    id: '456',
                    objectIdFieldName: 'id',
                    title: 'layer456',
                    fields: [{ alias: 'L1A', name: 'l.1.a' }, { alias: 'L2A', name: 'l.2.a' }],
                    features: [{ attributes: { id: 'a456', name: 'f2' } }],
                },
                {
                    id: '789',
                    objectIdFieldName: 'id',
                    title: 'layer789',
                    fields: [{ alias: 'L1A', name: 'l.1.a' }, { alias: 'L2A', name: 'l.2.a' }],
                    features: [{ attributes: { id: 'a789', name: 'f3' } }],
                },
            ],
        };

        const expectedData = [
            {
                id: '123',
                title: 'layer123',
                columns: [
                    { Header: 'L1A', accessor: 'l.1.a', show: true },
                    { Header: 'L2A', accessor: 'l.2.a', show: true },
                ],
                data: [
                    {
                        id: 'a123',
                        name: 'f1',
                        _id: 'a123',
                        _layerId: '123',
                        _selected: false,
                        _key: '123/a123',
                        _source: 'select',
                    },
                ],
            },
            {
                id: '456',
                title: 'layer456',
                columns: [
                    { Header: 'L1A', accessor: 'l.1.a', show: true },
                    { Header: 'L2A', accessor: 'l.2.a', show: true },
                ],
                data: [
                    {
                        id: 'a456',
                        name: 'f2',
                        _id: 'a456',
                        _layerId: '456',
                        _selected: false,
                        _key: '456/a456',
                        _source: 'select',
                    },
                ],
            },
            {
                id: '789',
                title: 'layer789',
                columns: [
                    { Header: 'L1A', accessor: 'l.1.a', show: true },
                    { Header: 'L2A', accessor: 'l.2.a', show: true },
                ],
                data: [
                    {
                        id: 'a789',
                        name: 'f3',
                        _id: 'a789',
                        _layerId: '789',
                        _selected: false,
                        _key: '789/a789',
                        _source: 'select',
                    },
                ],
            },
        ];

        expect(parseData(null, null, null)).toEqual([]);
        expect(parseData(null, true, 'select')).toEqual([]);
        expect(parseData(data, false, 'select')).toEqual(expect.arrayContaining(expectedData));
    });

    it('getActiveTable - should return correct table id', () => {
        const a = [{ id: '1' }, { id: '2'}, { id: '3' }];
        expect(getActiveTable(a, '2')).toBe('2');

        const b = [{ id: '1' }, { id: '2'}, { id: '3' }];
        expect(getActiveTable(b, '10')).toBe('1');

        const c = [];
        expect(getActiveTable(c, '2120')).toBe('');
    });

    it('syncWithLayersList', () => {
        const currentLayers = [{ id: '123' }, { id: '456' }, { id: '789' }];
        const layersList = [
            { id: '123', active: true },
            { id: '456', active: false },
            { id: '789', active: true },
        ];

        const currentActiveTable = '654';

        const r = syncWithLayersList(currentLayers, layersList, currentActiveTable);
        const { layers, activeTable } = r;

        expect(activeTable).toBe('123');
        expect(layers).toEqual(expect.arrayContaining([{ id: '123' }, { id: '789' }]));
    });

    it('deSelectFeatures', () => {
        const data = [
            {
                id: '123',
                title: 'layer123',
                columns: [
                    { Header: 'L1A', accessor: 'l.1.a', show: true },
                    { Header: 'L2A', accessor: 'l.2.a', show: true },
                ],
                data: [
                    {
                        _selected: true,
                        _source: 'select',
                    },
                ],
            },
            {
                id: '456',
                title: 'layer456',
                columns: [
                    { Header: 'L1A', accessor: 'l.1.a', show: true },
                    { Header: 'L2A', accessor: 'l.2.a', show: true },
                ],
                data: [
                    {
                        _selected: true,
                        _source: 'select',
                    },
                ],
            },
            {
                id: '789',
                title: 'layer789',
                columns: [
                    { Header: 'L1A', accessor: 'l.1.a', show: true },
                    { Header: 'L2A', accessor: 'l.2.a', show: true },
                ],
                data: [
                    {
                        _selected: true,
                        _source: 'search',
                    },
                ],
            },
        ];

        const expectedData = [{
            id: '789',
            title: 'layer789',
            columns: [
                { Header: 'L1A', accessor: 'l.1.a', show: true },
                { Header: 'L2A', accessor: 'l.2.a', show: true },
            ],
            data: [
                {
                    _selected: false,
                    _source: 'search',
                },
            ],
        }];

        const { layers, activeTable } = deSelectFeatures(data, '456');

        expect(layers).toEqual(expect.arrayContaining(expectedData));
        expect(activeTable).toBe('789');
    });

    it('toggleSelection', () => {
        const data = [
            {
                id: '123',
                columns: [],
                data: [
                    {
                        _id: 'a123',
                        _layerId: '123',
                        _selected: false,
                    },
                ],
            },
            {
                id: '456',
                columns: [],
                data: [
                    {
                        _id: 'a456',
                        _layerId: '456',
                        _selected: false,
                    },
                ],
            },
            {
                id: '789',
                columns: [],
                data: [
                    {
                        _id: 'a789',
                        _layerId: '789',
                        _selected: false,
                    },
                ],
            },
        ];

        const expectedData = [
            {
                id: '123',
                columns: [],
                data: [
                    {
                        _id: 'a123',
                        _layerId: '123',
                        _selected: false,
                    },
                ],
            },
            {
                id: '456',
                columns: [],
                data: [
                    {
                        _id: 'a456',
                        _layerId: '456',
                        _selected: false,
                    },
                ],
            },
            {
                id: '789',
                columns: [],
                data: [
                    {
                        _id: 'a789',
                        _layerId: '789',
                        _selected: true,
                    },
                ],
            },
        ];

        const feature = { _id: 'a789', _layerId: '789' };

        const layers = toggleSelection(data, feature);

        expect(layers).toEqual(expect.arrayContaining(expectedData));
    });
});
