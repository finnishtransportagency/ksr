import {
    cellEditValidate, getValue, equals, preventKeyPress,
} from '../cellEditValidate';

describe('cellEditValidate.js', () => {
    it('should return correct values for "esriFieldTypeString"', () => {
        expect(getValue('esriFieldTypeString', 'abc123')).toBe('abc123');
        expect(getValue('esriFieldTypeString', '')).toBe(null);
        expect(getValue('esriFieldTypeString', null)).toBe(null);
        expect(getValue('esriFieldTypeString', 3)).toBe('3');
        expect(getValue('esriFieldTypeString', 4.56)).toBe('4.56');
        expect(getValue('esriFieldTypeString', -5)).toBe('-5');
        expect(getValue('esriFieldTypeString', '3')).toBe('3');
        expect(getValue('esriFieldTypeString', '4.56')).toBe('4.56');
        expect(getValue('esriFieldTypeString', '-5')).toBe('-5');
        expect(getValue('esriFieldTypeString', true)).toBe('true');
        expect(getValue('esriFieldTypeString', '2018-10-16T05:38:11.992Z')).toBe('2018-10-16T05:38:11.992Z');
    });

    it('should return correct values for "esriFieldTypeSmallInteger"', () => {
        expect(getValue('esriFieldTypeSmallInteger', 'abc123')).toBe(null);
        expect(getValue('esriFieldTypeSmallInteger', '')).toBe(null);
        expect(getValue('esriFieldTypeSmallInteger', null)).toBe(null);
        expect(getValue('esriFieldTypeSmallInteger', 3)).toBe(3);
        expect(getValue('esriFieldTypeSmallInteger', 4.56)).toBe(4);
        expect(getValue('esriFieldTypeSmallInteger', -5)).toBe(-5);
        expect(getValue('esriFieldTypeSmallInteger', '3')).toBe(3);
        expect(getValue('esriFieldTypeSmallInteger', '4.56')).toBe(4);
        expect(getValue('esriFieldTypeSmallInteger', '-5')).toBe(-5);
        expect(getValue('esriFieldTypeSmallInteger', true)).toBe(null);
        expect(getValue('esriFieldTypeSmallInteger', '2018-10-16T05:38:11.992Z')).toBe(2018);
    });

    it('should return correct values for "esriFieldTypeInteger"', () => {
        expect(getValue('esriFieldTypeInteger', 'abc123')).toBe(null);
        expect(getValue('esriFieldTypeInteger', '')).toBe(null);
        expect(getValue('esriFieldTypeInteger', null)).toBe(null);
        expect(getValue('esriFieldTypeInteger', 3)).toBe(3);
        expect(getValue('esriFieldTypeInteger', 4.56)).toBe(4);
        expect(getValue('esriFieldTypeInteger', -5)).toBe(-5);
        expect(getValue('esriFieldTypeInteger', '3')).toBe(3);
        expect(getValue('esriFieldTypeInteger', '4.56')).toBe(4);
        expect(getValue('esriFieldTypeInteger', '-5')).toBe(-5);
        expect(getValue('esriFieldTypeInteger', true)).toBe(null);
        expect(getValue('esriFieldTypeInteger', '2018-10-16T05:38:11.992Z')).toBe(2018);
    });

    it('should return correct values for "esriFieldTypeDouble"', () => {
        expect(getValue('esriFieldTypeDouble', 'abc123')).toBe(null);
        expect(getValue('esriFieldTypeDouble', '')).toBe(null);
        expect(getValue('esriFieldTypeDouble', null)).toBe(null);
        expect(getValue('esriFieldTypeDouble', 3)).toBe(3);
        expect(getValue('esriFieldTypeDouble', 4.56)).toBe(4.56);
        expect(getValue('esriFieldTypeDouble', -5)).toBe(-5);
        expect(getValue('esriFieldTypeDouble', '3')).toBe(3);
        expect(getValue('esriFieldTypeDouble', '4.56')).toBe(4.56);
        expect(getValue('esriFieldTypeDouble', '-5')).toBe(-5);
        expect(getValue('esriFieldTypeDouble', true)).toBe(null);
        expect(getValue('esriFieldTypeDouble', '2018-10-16T05:38:11.992Z')).toBe(2018);
    });

    it('should return correct values for "esriFieldTypeDate"', () => {
        expect(getValue('esriFieldTypeDate', 'abc123')).toBe(null);
        expect(getValue('esriFieldTypeDate', '')).toBe(null);
        expect(getValue('esriFieldTypeDate', null)).toBe(null);
        expect(getValue('esriFieldTypeDate', 3)).toBe(3);
        expect(getValue('esriFieldTypeDate', 4.56)).toBe(4);
        expect(getValue('esriFieldTypeDate', -5)).toBe(-5);
        expect(getValue('esriFieldTypeDate', '4.56')).toBe(null);
        expect(getValue('esriFieldTypeDate', true)).toBe(1);
        expect(getValue('esriFieldTypeDate', '2018-10-16T05:38:11.992Z')).toBe(1539668291992);
    });

    it('cellEditValidate - new edit - text', () => {
        const value = 'edit - 2.2';
        const layerData = [
            {
                COLUMN_1: 'value - 1.1',
                COLUMN_2: 'value - 1.2',
                COLUMN_3: 'value - 1.3',
                _edited: [],
            },
            {
                COLUMN_1: 'value - 2.1',
                COLUMN_2: 'value - 2.2',
                COLUMN_3: 'value - 2.3',
                _edited: [],
            },
            {
                COLUMN_1: 'value - 3.1',
                COLUMN_2: 'value - 3.2',
                COLUMN_3: 'value - 3.3',
                _edited: [],
            },
        ];
        const cellField = { type: 'esriFieldTypeString' };
        const cellInfo = { column: { id: 'COLUMN_2' }, index: 1 };

        const expected = {
            COLUMN_1: 'value - 2.1',
            COLUMN_2: 'edit - 2.2',
            COLUMN_3: 'value - 2.3',
            _edited: [
                {
                    editedData: 'edit - 2.2',
                    originalData: 'value - 2.2',
                    title: 'COLUMN_2',
                },
            ],
        };

        expect(cellEditValidate(value, layerData, cellField, cellInfo)).toEqual(expected);
    });

    it('cellEditValidate - old edit, undo changes - text', () => {
        const value = 'value - 2.2';
        const layerData = [
            {
                COLUMN_1: 'value - 1.1',
                COLUMN_2: 'value - 1.2',
                COLUMN_3: 'value - 1.3',
                _edited: [],
            },
            {
                COLUMN_1: 'value - 2.1',
                COLUMN_2: 'edit - 2.2',
                COLUMN_3: 'value - 2.3',
                _edited: [
                    {
                        editedData: 'edit - 2.2',
                        originalData: 'value - 2.2',
                        title: 'COLUMN_2',
                    },
                ],
            },
            {
                COLUMN_1: 'value - 3.1',
                COLUMN_2: 'value - 3.2',
                COLUMN_3: 'value - 3.3',
                _edited: [],
            },
        ];

        const cellField = { type: 'esriFieldTypeString' };
        const cellInfo = { column: { id: 'COLUMN_2' }, index: 1 };

        const expected = {
            COLUMN_1: 'value - 2.1',
            COLUMN_2: 'value - 2.2',
            COLUMN_3: 'value - 2.3',
            _edited: [],
        };

        expect(cellEditValidate(value, layerData, cellField, cellInfo)).toEqual(expected);
    });

    it('cellEditValidate - old edit, change value - text', () => {
        const value = 'other edit - 2.2';
        const layerData = [
            {
                COLUMN_1: 'value - 1.1',
                COLUMN_2: 'value - 1.2',
                COLUMN_3: 'value - 1.3',
                _edited: [],
            },
            {
                COLUMN_1: 'value - 2.1',
                COLUMN_2: 'edit - 2.2',
                COLUMN_3: 'value - 2.3',
                _edited: [
                    {
                        editedData: 'edit - 2.2',
                        originalData: 'value - 2.2',
                        title: 'COLUMN_2',
                    },
                ],
            },
            {
                COLUMN_1: 'value - 3.1',
                COLUMN_2: 'value - 3.2',
                COLUMN_3: 'value - 3.3',
                _edited: [],
            },
        ];

        const cellField = { type: 'esriFieldTypeString' };
        const cellInfo = { column: { id: 'COLUMN_2' }, index: 1 };

        const expected = {
            COLUMN_1: 'value - 2.1',
            COLUMN_2: 'other edit - 2.2',
            COLUMN_3: 'value - 2.3',
            _edited: [
                {
                    editedData: 'other edit - 2.2',
                    originalData: 'value - 2.2',
                    title: 'COLUMN_2',
                },
            ],
        };

        expect(cellEditValidate(value, layerData, cellField, cellInfo)).toEqual(expected);
    });

    it('cellEditValidate - index larger than row-count - text', () => {
        const value = 'other edit - 2.2';
        const layerData = [
            {
                COLUMN_1: 'value - 1.1',
                COLUMN_2: 'value - 1.2',
                COLUMN_3: 'value - 1.3',
                _edited: [],
            },
            {
                COLUMN_1: 'value - 2.1',
                COLUMN_2: 'edit - 2.2',
                COLUMN_3: 'value - 2.3',
                _edited: [
                    {
                        editedData: 'edit - 2.2',
                        originalData: 'value - 2.2',
                        title: 'COLUMN_2',
                    },
                ],
            },
            {
                COLUMN_1: 'value - 3.1',
                COLUMN_2: 'value - 3.2',
                COLUMN_3: 'value - 3.3',
                _edited: [],
            },
        ];

        const cellField = { type: 'esriFieldTypeString' };
        const cellInfo = { column: { id: 'COLUMN_2' }, index: 4 };

        expect(cellEditValidate(value, layerData, cellField, cellInfo)).toBe(null);
    });

    it('cellEditValidate - new edit on same row, different column - text', () => {
        const value = 'edit - 1.1';
        const layerData = [
            {
                COLUMN_1: 'value - 1.1',
                COLUMN_2: 'edit - 1.2',
                COLUMN_3: 'value - 1.3',
                _edited: [
                    {
                        editedData: 'edit - 1.2',
                        originalData: 'value - 1.2',
                        title: 'COLUMN_2',
                    },
                ],
            },
        ];

        const cellField = { type: 'esriFieldTypeString' };
        const cellInfo = { column: { id: 'COLUMN_1' }, index: 0 };

        const expected = {
            COLUMN_1: 'edit - 1.1',
            COLUMN_2: 'edit - 1.2',
            COLUMN_3: 'value - 1.3',
            _edited: [
                {
                    editedData: 'edit - 1.1',
                    originalData: 'value - 1.1',
                    title: 'COLUMN_1',
                },
                {
                    editedData: 'edit - 1.2',
                    originalData: 'value - 1.2',
                    title: 'COLUMN_2',
                },
            ],
        };

        expect(cellEditValidate(value, layerData, cellField, cellInfo)).toEqual(expected);
    });

    it('cellEditValidate - old edit on same row, different column - text', () => {
        const value = 'new edit - 1.2';
        const layerData = [
            {
                COLUMN_1: 'edit - 1.1',
                COLUMN_2: 'edit - 1.2',
                COLUMN_3: 'value - 1.3',
                _edited: [
                    {
                        editedData: 'edit - 1.1',
                        originalData: 'value - 1.1',
                        title: 'COLUMN_1',
                    },
                    {
                        editedData: 'edit - 1.2',
                        originalData: 'value - 1.2',
                        title: 'COLUMN_2',
                    },
                ],
            },
        ];

        const cellField = { type: 'esriFieldTypeString' };
        const cellInfo = { column: { id: 'COLUMN_2' }, index: 0 };

        const expected = {
            COLUMN_1: 'edit - 1.1',
            COLUMN_2: 'new edit - 1.2',
            COLUMN_3: 'value - 1.3',
            _edited: [
                {
                    editedData: 'edit - 1.1',
                    originalData: 'value - 1.1',
                    title: 'COLUMN_1',
                },
                {
                    editedData: 'new edit - 1.2',
                    originalData: 'value - 1.2',
                    title: 'COLUMN_2',
                },
            ],
        };

        expect(cellEditValidate(value, layerData, cellField, cellInfo)).toEqual(expected);
    });

    it('equals', () => {
        expect(equals('a', 'a')).toBe(true);
        expect(equals('a', 'a  ')).toBe(true);
        expect(equals('a  ', 'a')).toBe(true);
        expect(equals('a  ', 'a  ')).toBe(true);
        expect(equals('', '')).toBe(true);
        expect(equals(undefined, '')).toBe(true);
        expect(equals(null, '')).toBe(true);
        expect(equals(undefined, undefined)).toBe(true);
        expect(equals(null, null)).toBe(true);
        expect(equals('', undefined)).toBe(true);
        expect(equals('', null)).toBe(true);
        expect(equals(5, 5)).toBe(true);

        expect(equals('a', 'b')).toBe(false);
        expect(equals(1, 2)).toBe(false);
        expect(equals('a', null)).toBe(false);
        expect(equals('a', undefined)).toBe(false);
        expect(equals(null, 'b')).toBe(false);
        expect(equals(undefined, 'b')).toBe(false);
        expect(equals(undefined, null)).toBe(false);
        expect(equals(null, undefined)).toBe(false);
        expect(equals({}, {})).toBe(false);
        expect(equals([], [])).toBe(false);
    });

    it('preventKeyPress - esriFieldTypeSmallInteger - invalid integer', () => {
        const e = { preventDefault: jest.fn(), key: 'e', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeSmallInteger' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('preventKeyPress - esriFieldTypeSmallInteger - string with space', () => {
        const e = { preventDefault: jest.fn(), key: ' ', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeSmallInteger' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('preventKeyPress - esriFieldTypeSmallInteger - valid integer', () => {
        const e = { preventDefault: jest.fn(), key: '9', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeSmallInteger' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalledTimes(0);
    });

    it('preventKeyPress - esriFieldTypeInteger - invalid integer', () => {
        const e = { preventDefault: jest.fn(), key: 'e', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeInteger' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('preventKeyPress - esriFieldTypeInteger - string with space', () => {
        const e = { preventDefault: jest.fn(), key: ' ', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeInteger' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('preventKeyPress - esriFieldTypeInteger - valid integer', () => {
        const e = { preventDefault: jest.fn(), key: '9', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeInteger' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalledTimes(0);
    });

    it('preventKeyPress - esriFieldTypeDouble - invalid integer', () => {
        const e = { preventDefault: jest.fn(), key: 'e', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeDouble' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('preventKeyPress - esriFieldTypeDouble - string with space', () => {
        const e = { preventDefault: jest.fn(), key: ' ', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeDouble' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('preventKeyPress - esriFieldTypeDouble - string with dot', () => {
        const e = { preventDefault: jest.fn(), key: '.', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeDouble' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalledTimes(0);
    });

    it('preventKeyPress - esriFieldTypeDouble - valid integer', () => {
        const e = { preventDefault: jest.fn(), key: '9', target: { innerText: '' } };
        const cellField = { type: 'esriFieldTypeDouble' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalledTimes(0);
    });

    it('preventKeyPress - too long text', () => {
        const e = { preventDefault: jest.fn(), key: '9', target: { innerText: '123' } };
        const cellField = { length: 3, type: 'esriFieldTypeString' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('preventKeyPress - valid text', () => {
        const e = { preventDefault: jest.fn(), key: '9', target: { innerText: '123' } };
        const cellField = { length: 4, type: 'esriFieldTypeString' };

        preventKeyPress(e, cellField);
        expect(e.preventDefault).toHaveBeenCalledTimes(0);
    });
});
