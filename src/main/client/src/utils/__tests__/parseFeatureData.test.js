import { mergeData, mergeColumns } from '../parseFeatureData';

describe('parseFeatureData', () => {
    it('mergeData - it should merge features', () => {
        const a = new Map([
            ['a', {
                n: 1,
                id: 'a',
                _selected: true,
                _source: 'select',
            }],
            ['b', {
                n: 2,
                id: 'b',
                _selected: false,
                _source: 'search',
            }],
            ['c', {
                n: 3,
                id: 'c',
                _selected: true,
                _source: 'search',
            }],
            ['d', {
                n: 4,
                id: 'd',
                _selected: false,
                _source: 'search',
            }],
        ]);

        const b = new Map([
            ['b', {
                n: 2,
                id: 'b',
                _selected: true,
                _source: 'select',
            }],
            ['d', {
                n: 4,
                id: 'd',
                _selected: true,
                _source: 'select',
            }],
            ['e', {
                n: 5,
                id: 'e',
                _selected: true,
                _source: 'select',
            }],
            ['f', {
                n: 6,
                id: 'f',
                _selected: true,
                _source: 'select',
            }],
        ]);

        const c = new Set(['a', 'c']);

        const { data, dataFromSelect } = mergeData(a, b, c);

        expect(data.size).toBe(4);
        expect(dataFromSelect.size).toBe(4);
        expect(dataFromSelect.has('b')).toBe(true);
        expect(dataFromSelect.has('d')).toBe(true);
        expect(dataFromSelect.has('e')).toBe(true);
        expect(dataFromSelect.has('f')).toBe(true);
        expect(Array.from(data.values()).filter(o => o._selected).length).toBe(4);
    });

    it('mergeColumns - it should merge columns', () => {
        const a = new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
            ['d', 4],
            ['g', 7],
        ]);

        const b = new Map([
            ['b', 2],
            ['c', 3],
            ['e', 5],
            ['f', 6],
        ]);

        const c = new Set(['a', 'g']);

        const { columns, columnsFromSelect } = mergeColumns(a, b, c);

        expect(columns.size).toBe(5);
        expect(columns.has('a')).toBe(false);
        expect(columns.has('g')).toBe(false);
        expect(columns.has('b')).toBe(true);
        expect(columns.has('c')).toBe(true);
        expect(columns.has('d')).toBe(true);
        expect(columns.has('e')).toBe(true);
        expect(columns.has('f')).toBe(true);
        expect(columnsFromSelect.size).toBe(2);
        expect(columnsFromSelect.has('e')).toBe(true);
        expect(columnsFromSelect.has('f')).toBe(true);
    });
});
