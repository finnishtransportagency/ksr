import { filterNotAllowedFields, themeLayerFields } from '../fields';

describe.skip('fields tests', () => {
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

    it('themeLayerFields - should return allowed fields only', () => {
        const layer = {
            fields: [
                { name: 'textField', label: 'Text Field', type: 'esriFieldTypeString' },
                { name: 'dateField', label: 'Date Field', type: 'esriFieldTypeDate' },
                { name: 'doubleField', label: 'Double Field', type: 'esriFieldTypeDouble' },
                { name: 'integerField', label: 'Integer Field', type: 'esriFieldTypeInteger' },
                { name: 'intField', label: 'Int Field', type: 'esriFieldTypeSmallInteger' },
                { name: 'objectid', label: 'Label Field', type: 'esriFieldTypeInteger' },
                { name: 'id', label: 'Id Field', type: 'esriFieldTypeInteger' },
            ],
        };

        const expectedThemeFields = [
            { label: 'Double Field', value: 'doubleField' },
            { label: 'Integer Field', value: 'integerField' },
            { label: 'Int Field', value: 'intField' },
        ];

        expect(themeLayerFields(layer)).toEqual(expectedThemeFields);
    });

    it('themeLayerFields - should return empty list', () => {
        const layer1 = {
            fields: [
                { name: 'textField', label: 'Text Field', type: 'esriFieldTypeString' },
                { name: 'objectid', label: 'Label Field', type: 'esriFieldTypeInteger' },
            ],
        };

        const layer2 = {};

        expect(themeLayerFields(layer1)).toEqual([]);
        expect(themeLayerFields(layer2)).toEqual([]);
    });
});
