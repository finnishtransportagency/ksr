import { addActionColumn } from '../actionColumn';

describe('actionColumn.js', () => {
    it('addActionColumn - should add extra column as first index', () => {
        const columns = [{
            Header: 'OBJECTID',
            accessorr: '123/OBJECTID',
        }, {
            Header: 'CREATED_DATE',
            accessorr: '123/CREATED_DATE',
        }];

        expect(addActionColumn(jest.fn(), jest.fn(), columns)[0]).toHaveProperty('columns');
        expect(addActionColumn(jest.fn(), jest.fn(), columns)).toHaveLength(3);
    });
});
