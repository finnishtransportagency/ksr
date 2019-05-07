import { addContractColumn } from '../contractColumn';

describe('createGeoconvertParams', () => {
    it('addContractColumn - should add extra column as first index', () => {
        const setActiveModal = jest.fn();
        const columns = [{
            Header: 'OBJECTID',
            accessorr: '123/OBJECTID',
        }, {
            Header: 'CREATED_DATE',
            accessorr: '123/CREATED_DATE',
        }];

        expect(addContractColumn(setActiveModal, columns)[0]).toHaveProperty('columns');
        expect(addContractColumn(setActiveModal, columns)).toHaveLength(3);
    });
});
