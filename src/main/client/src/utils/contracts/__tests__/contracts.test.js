import {
    contractListTexts, getAttribute, getContractLayers, getFeatureAttributes,
} from '../contracts';

describe('contracts', () => {
    it('contractListTexts - should return array with correct values', () => {
        const contracts = {
            layerId: 123,
            features: [
                {
                    attributes: {
                        contractId: 123,
                        contractDescription: 'Test description.',
                        tiimeriLinkField: '123',
                        caseManagementLinkField: '123',
                    },
                },
                {
                    attributes: {
                        contractId: 456,
                        contractDescription: 'Test description 2.',
                        tiimeriLinkField: '456',
                        caseManagementLinkField: '456',
                    },
                },
            ],
        };
        const contractIdField = 'contractId';
        const contractDescriptionField = 'contractDescription';
        const tiimeriLinkField = 'tiimeriLinkField';
        const caseManagementLinkField = 'caseManagementLinkField';
        const contractUnlinkable = false;

        const expectedResult = [
            {
                id: 123,
                layerId: 123,
                description: 'Test description.',
                tiimeriUrl: 'http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=123',
                attributes: {
                    tiimeriLinkField: '123',
                    caseManagementLinkField: '123',
                    contractDescription: 'Test description.',
                    contractId: 123,
                },
                caseManagementUrl: 'http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=123',
                contractUnlinkable: false,
            },
            {
                id: 456,
                layerId: 123,
                description: 'Test description 2.',
                tiimeriUrl: 'http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=456',
                attributes: {
                    tiimeriLinkField: '456',
                    caseManagementLinkField: '456',
                    contractDescription: 'Test description 2.',
                    contractId: 456,
                },
                caseManagementUrl: 'http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=456',
                contractUnlinkable: false,
            },
        ];

        expect(contractListTexts(
            contracts,
            contractIdField,
            contractDescriptionField,
            tiimeriLinkField,
            caseManagementLinkField,
            contractUnlinkable,
        )).toEqual(expectedResult);
    });

    it('contractListTexts - should return empty array', () => {
        const contracts = {
            features: [],
        };
        const contractIdField = 'contractId';
        const contractDescriptionField = 'contractDescription';
        const tiimeriLinkField = 'tiimeriLinkField';
        const caseManagementLinkField = 'caseManagementLinkField';
        const contractUnlinkable = false;

        const contracts2 = null;

        expect(contractListTexts(
            contracts,
            contractIdField,
            contractDescriptionField,
            tiimeriLinkField,
            caseManagementLinkField,
            contractUnlinkable,
        )).toEqual([]);
        expect(contractListTexts(
            contracts2,
            contractIdField,
            contractDescriptionField,
            tiimeriLinkField,
            caseManagementLinkField,
            contractUnlinkable,
        )).toEqual([]);
    });

    it('getContractLayers - should work correctly with relation type one', () => {
        const layerList = [
            { id: '1', relations: [{ relationLayerId: '10', relationType: 'one' }] },
            { id: '10', relations: [{ relationType: 'one' }] },
        ];

        const expectedResult = {
            currentLayer: { id: '1', relations: [{ relationLayerId: '10', relationType: 'one' }] },
            contractLayers: [{ id: '10', relations: [{ relationType: 'one' }] }],
        };

        expect(getContractLayers('1', layerList)).toEqual(expectedResult);
    });

    it('getContractLayers - should work correctly with relation type many', () => {
        const layerList = [
            { id: '1', relations: [{ relationLayerId: '10', relationType: 'many' }] },
            { id: '10', relations: [{ relationLayerId: '11', relationType: 'link' }] },
            { id: '11', relations: [{ relationType: 'many' }] },
        ];

        const expectedResult = {
            currentLayer: { id: '1', relations: [{ relationLayerId: '10', relationType: 'many' }] },
            contractLayers: [{ id: '11', relations: [{ relationType: 'many' }] }],
        };

        expect(getContractLayers('1', layerList)).toEqual(expectedResult);
    });

    it('getAttribute - should return object with name and value', () => {
        const layer = {
            name: 'Layer 1',
            id: '123',
            contractIdField: 'idField',
            contractDescriptionField: 'field2',
            fields: [
                { name: 'objectId', type: 'esriFieldTypeOID' },
                { name: 'idField', type: 'esriFieldTypeString' },
                { name: 'name2', label: 'label2', type: 'esriFieldTypeString' },
                { name: 'name3', label: 'label3', type: 'esriFieldTypeInteger' },
            ],
        };

        const attribute0 = ['objectId', 1];
        const expectedValue0 = {
            name: 'objectId', label: 'objectId', value: 1, hidden: true,
        };
        expect(getAttribute(layer, attribute0)).toEqual(expectedValue0);

        const attribute1 = ['idField', 123456];
        const expectedValue1 = {
            name: 'idField', label: 'idField', value: 123456, hidden: false,
        };
        expect(getAttribute(layer, attribute1)).toEqual(expectedValue1);

        const attribute2 = ['name2', 'value2'];
        const expectedValue2 = {
            name: 'name2', label: 'label2', value: 'value2', hidden: false,
        };
        expect(getAttribute(layer, attribute2)).toEqual(expectedValue2);

        const attribute3 = ['name3', 123];
        const expectedValue3 = {
            name: 'name3', label: 'label3', value: 123, hidden: false,
        };
        expect(getAttribute(layer, attribute3)).toEqual(expectedValue3);
    });

    it('getFeatureAttributes - should return list of attribute values', () => {
        const layer = {
            name: 'Layer 1',
            id: '123',
            contractIdField: 'idField',
            contractDescriptionField: 'field2',
            fields: [
                { name: 'idField', type: 'esriFieldTypeOID' },
                { name: 'name2', type: 'esriFieldTypeString' },
                { name: 'name3', type: 'esriFieldTypeInteger' },
            ],
        };
        const contractDetails = [{
            id: '123',
            name: 'Layer 1',
            features: [
                { attributes: { idField: 123, name2: 'Value 2', name3: 1000 } },
            ],
        }];
        const activeFeature = { layerName: 'Layer 1', layerId: '123', objectId: 123 };

        const expectedValue = [['idField', 123], ['name2', 'Value 2'], ['name3', 1000]];
        expect(getFeatureAttributes(layer, contractDetails, activeFeature)).toEqual(expectedValue);
    });
});
