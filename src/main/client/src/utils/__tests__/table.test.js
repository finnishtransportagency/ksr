import { clearEdits, handleData, applyEdits, applyDeletedFeatures } from '../table';

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
});
