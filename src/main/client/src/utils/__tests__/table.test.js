import {
    clearEdits,
    handleData,
    applyEdits,
    applyDeletedFeatures,
    columnsWithoutLayerId,
    columnsWithLayerId,
    findEditedData,
    applyEditedLayers,
} from '../table';

describe('utils/table', () => {
    it('should clearEdits - 1', () => {
        const data = {
            a: 1,
            b: 2,
            c: 3,
            _edited: [
                {
                    title: 'a',
                    editedData: 11,
                },
                {
                    title: 'c',
                    editedData: 33,
                },
            ],
        };

        const expectedData = {
            a: 11,
            b: 2,
            c: 33,
            _edited: [],
        };

        expect(clearEdits(data)).toMatchObject(expectedData);
    });

    it('should clearEdits - 2', () => {
        const data = {
            a: 1,
            b: 2,
            c: 3,
            _edited: [],
        };

        const expectedData = {
            a: 1,
            b: 2,
            c: 3,
            _edited: [],
        };

        expect(clearEdits(data)).toMatchObject(expectedData);
    });

    it('should handleData - 1', () => {
        const editFeatures = [1, 2];
        const data = [
            {
                a: 1,
                b: 2,
                c: 3,
                _id: 1,
                _edited: [
                    {
                        title: 'a',
                        editedData: 11,
                    },
                    {
                        title: 'c',
                        editedData: 33,
                    },
                ],
            },
            {
                a: 11,
                b: 12,
                c: 13,
                _id: 2,
                _edited: [
                    {
                        title: 'a',
                        editedData: 111,
                    },
                    {
                        title: 'c',
                        editedData: 233,
                    },
                ],
            },
            {
                a: 111,
                b: 121,
                c: 131,
                _id: 12,
                _edited: [
                    {
                        title: 'a21',
                        editedData: 1111,
                    },
                    {
                        title: 'c21',
                        editedData: 2331,
                    },
                ],
            },
        ];

        const expectedData = [
            {
                a: 11,
                b: 2,
                c: 33,
                _id: 1,
                _edited: [],
            },
            {
                a: 111,
                b: 12,
                c: 233,
                _id: 2,
                _edited: [],
            },
            {
                a: 111,
                b: 121,
                c: 131,
                _id: 12,
                _edited: [
                    {
                        title: 'a21',
                        editedData: 1111,
                    },
                    {
                        title: 'c21',
                        editedData: 2331,
                    },
                ],
            },
        ];

        expect(handleData(data, editFeatures)).toMatchObject(expectedData);
    });

    it('should handleData - 2', () => {
        expect(handleData([], [1, 2, 3])).toMatchObject([]);
    });

    it('should handleData - 3', () => {
        const editFeatures = [1, 2, 12];
        const data = [
            {
                a: 1,
                b: 2,
                c: 3,
                _id: 1,
                _edited: [
                    {
                        title: 'a',
                        editedData: 11,
                    },
                    {
                        title: 'c',
                        editedData: 33,
                    },
                ],
            },
            {
                a: 11,
                b: 12,
                c: 13,
                _id: 2,
                _edited: [
                    {
                        title: 'a',
                        editedData: 111,
                    },
                    {
                        title: 'c',
                        editedData: 233,
                    },
                ],
            },
            {
                a: 111,
                b: 121,
                c: 131,
                _id: 12,
                _edited: [
                    {
                        title: 'a21',
                        editedData: 1111,
                    },
                    {
                        title: 'c21',
                        editedData: 2331,
                    },
                ],
            },
        ];

        const expectedData = [
            {
                a: 11,
                b: 2,
                c: 33,
                _id: 1,
                _edited: [],
            },
            {
                a: 111,
                b: 12,
                c: 233,
                _id: 2,
                _edited: [],
            },
            {
                a: 111,
                b: 121,
                c: 131,
                _id: 12,
                _edited: [],
            },
        ];

        expect(handleData(data, editFeatures)).toMatchObject(expectedData);
    });

    it('should applyEdits - 1', () => {
        const layers = [
            {
                id: 'L1',
                data: [
                    {
                        a: 1,
                        b: 2,
                        c: 3,
                        _id: 1,
                        _edited: [
                            {
                                title: 'a',
                                editedData: 11,
                            },
                            {
                                title: 'c',
                                editedData: 33,
                            },
                        ],
                    },
                    {
                        a: 11,
                        b: 12,
                        c: 13,
                        _id: 2,
                        _edited: [
                            {
                                title: 'a',
                                editedData: 111,
                            },
                            {
                                title: 'c',
                                editedData: 233,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'L2',
                data: [
                    {
                        a: 111,
                        b: 121,
                        c: 131,
                        _id: 12,
                        _edited: [
                            {
                                title: 'a',
                                editedData: 1111,
                            },
                            {
                                title: 'c',
                                editedData: 2331,
                            },
                        ],
                    },
                ],
            },
        ];

        const edits = [
            {
                layerId: 'L1',
                features: [1, 2],
            },
            {
                layerId: 'L2',
                features: [12],
            },
        ];

        const expectedLayers = [
            {
                id: 'L1',
                data: [
                    {
                        a: 11,
                        b: 2,
                        c: 33,
                        _id: 1,
                        _edited: [],
                    },
                    {
                        a: 111,
                        b: 12,
                        c: 233,
                        _id: 2,
                        _edited: [],
                    },
                ],
            },
            {
                id: 'L2',
                data: [
                    {
                        a: 1111,
                        b: 121,
                        c: 2331,
                        _id: 12,
                        _edited: [],
                    },
                ],
            },
        ];

        expect(applyEdits(layers, edits)).toMatchObject(expectedLayers);
    });

    it('should applyEdits - 2', () => {
        expect(applyEdits([], [])).toMatchObject([]);
    });

    it('applyDeletedFeatures - should remove given IDs', () => {
        const layers = [
            {
                id: '1',
                data: [
                    {
                        _id: 123,
                    },
                    {
                        _id: 456,
                    },
                    {
                        _id: 987,
                    },
                ],
            },
        ];
        const objectIds = '123, 987';
        const layerId = '1';

        const expectedResult = [
            {
                id: '1',
                data: [
                    {
                        _id: 456,
                    },
                ],
            },
        ];

        expect(applyDeletedFeatures(layers, objectIds, layerId)).toMatchObject(expectedResult);
    });

    it('applyDeletedFeatures - should only return layers with data', () => {
        const layers = [
            {
                id: '1',
                data: [
                    {
                        _id: 123,
                    },
                    {
                        _id: 456,
                    },
                    {
                        _id: 987,
                    },
                ],
            },
        ];
        const objectIds = '123, 987, 456';
        const layerId = '1';

        const expectedResult = [];

        expect(applyDeletedFeatures(layers, objectIds, layerId)).toMatchObject(expectedResult);
    });

    it('columnsWithoutLayerId - should return correct values if key IS NOT _edited', () => {
        const key = '_layerId';
        const data = {
            '123/Objectid': 1,
            _edited: [],
            _layerId: '123',
        };
        const foundData = {};

        const expectedResult = { _layerId: '123' };
        expect(columnsWithoutLayerId(key, data, foundData)).toMatchObject(expectedResult);
    });

    it('columnsWithoutLayerId - should return correct values if key IS _edited', () => {
        const key = '_edited';
        let data;
        let foundData;
        let expectedResult;

        data = {
            '123/Objectid': 1,
            _edited: [{
                originalValue: 'Test 1',
                editedValue: 'Test 1',
                title: '123/Objectid',
            }],
            _layerId: '123',
        };
        foundData = {
            _edited: [{
                originalValue: 'Test 1',
                editedValue: 'Test 2',
                title: '123/Objectid',
            }],
        };

        expectedResult = {
            _edited: [{
                originalValue: 'Test 1',
                editedValue: 'Test 2',
                title: '123/Objectid',
            }],
        };
        expect(columnsWithoutLayerId(key, data, foundData)).toMatchObject(expectedResult);

        data = {
            '123.s/Objectid': 1,
            _edited: [{
                originalValue: 'Test 1',
                editedValue: 'Test 1',
                title: '123.s/Objectid',
            }],
            _layerId: '123.s',
        };
        foundData = {
            _edited: [{
                originalValue: 'Test 1',
                editedValue: 'Test 2',
                title: '123/Objectid',
            }],
        };

        expectedResult = {
            _edited: [{
                originalValue: 'Test 1',
                editedValue: 'Test 2',
                title: '123.s/Objectid',
            }],
        };
        expect(columnsWithoutLayerId(key, data, foundData)).toMatchObject(expectedResult);
    });

    it('columnsWithLayerId - should return correct data', () => {
        const key = '123/Testcolumn';
        const foundData = { '123/Testcolumn': 'New value' };
        const editedLayerId = '123';
        let data;
        let expectedResult;

        data = {
            '123/Objectid': 1,
            '123/Testcolumn': 'Original value',
            _edited: [],
            _layerId: '123',
        };

        expectedResult = { '123/Testcolumn': 'New value' };
        expect(columnsWithLayerId(key, data, foundData, editedLayerId))
            .toMatchObject(expectedResult);

        data = {
            '123.s/Objectid': 1,
            '123.s/Testcolumn': 'Original value',
            _edited: [],
            _layerId: '123.s',
        };

        expectedResult = { '123.s/Testcolumn': 'New value' };
        expect(columnsWithLayerId(key, data, foundData, editedLayerId))
            .toMatchObject(expectedResult);
    });

    it('findEditedData - should return correct edited data', () => {
        const layer = {
            data: [
                {
                    _layerId: '123',
                    _id: 1,
                    _edited: [],
                    '123/Testcolumn': 'Original value',
                },
                {
                    _layerId: '123',
                    _id: 2,
                    _edited: [],
                    '123/Testcolumn': 'Original value',
                },
            ],
        };
        const editedData = {
            _layerId: '123',
            _id: 1,
            '123/Testcolumn': 'New value',
            _edited: [{
                originalValue: 'Original value',
                editedValue: 'New value',
                title: '123/Testcolumn',
            }],
        };

        const expectedResult = [
            {
                _layerId: '123',
                _id: 1,
                _edited: [{
                    originalValue: 'Original value',
                    editedValue: 'New value',
                    title: '123/Testcolumn',
                }],
                '123/Testcolumn': 'New value',
            },
            {
                _layerId: '123',
                _id: 2,
                _edited: [],
                '123/Testcolumn': 'Original value',
            },
        ];
        expect(findEditedData(layer, editedData)).toMatchObject(expectedResult);
    });

    it('applyEditedLayers - should return correct edited layers data', () => {
        const editedLayers = [{
            id: '123',
            data: [
                {
                    _layerId: '123',
                    _id: 1,
                    _edited: [],
                    '123/Testcolumn': 'Original value',
                },
                {
                    _layerId: '123',
                    _id: 2,
                    _edited: [],
                    '123/Testcolumn': 'Original value',
                },
            ],
        }, {
            id: '123.s',
            data: [
                {
                    _layerId: '123.s',
                    _id: 1,
                    _edited: [],
                    '123.s/Testcolumn': 'Original value',
                },
                {
                    _layerId: '123.s',
                    _id: 2,
                    _edited: [],
                    '123.s/Testcolumn': 'Original value',
                },
            ],
        }];
        const editedData = {
            _layerId: '123',
            _id: 1,
            '123/Testcolumn': 'New value',
            _edited: [{
                originalValue: 'Original value',
                editedValue: 'New value',
                title: '123/Testcolumn',
            }],
        };

        const expectedResult = [{
            id: '123',
            data: [
                {
                    _layerId: '123',
                    _id: 1,
                    _edited: [{
                        originalValue: 'Original value',
                        editedValue: 'New value',
                        title: '123/Testcolumn',
                    }],
                    '123/Testcolumn': 'New value',
                },
                {
                    _layerId: '123',
                    _id: 2,
                    _edited: [],
                    '123/Testcolumn': 'Original value',
                },
            ],
        }, {
            id: '123.s',
            data: [
                {
                    _layerId: '123.s',
                    _id: 1,
                    _edited: [{
                        originalValue: 'Original value',
                        editedValue: 'New value',
                        title: '123.s/Testcolumn',
                    }],
                    '123.s/Testcolumn': 'New value',
                },
                {
                    _layerId: '123.s',
                    _id: 2,
                    _edited: [],
                    '123.s/Testcolumn': 'Original value',
                },
            ],
        }];
        expect(applyEditedLayers(editedLayers, editedData)).toMatchObject(expectedResult);
    });
});
