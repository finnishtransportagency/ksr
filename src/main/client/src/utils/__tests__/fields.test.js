import { filterNotAllowedFields } from '../fields';

describe('fields tests', () => {
    const fields = [{
        value: 0,
        label: 'OBJECTID_1',
        type: 'esriFieldTypeOID',
        name: 'OBJECTID_1',
    }, {
        value: 1,
        label: 'Rakennuksen numero',
        type: 'esriFieldTypeInteger',
        name: 'RAK_NRO',
    }, {
        value: 2,
        label: 'Rakennuksen nimi',
        type: 'esriFieldTypeString',
        name: 'RAK_NIMI',
    }];

    const expected = [{
        value: 1,
        label: 'Rakennuksen numero',
        type: 'esriFieldTypeInteger',
        name: 'RAK_NRO',
    }, {
        value: 2,
        label: 'Rakennuksen nimi',
        type: 'esriFieldTypeString',
        name: 'RAK_NIMI',
    }];

    it('should return only allowed fields', () => {
        expect(filterNotAllowedFields(fields)).toEqual(expected);
    });

    it('should return empty list if layer has no fields', () => {
        expect(filterNotAllowedFields(undefined)).toEqual([]);
    });
});
