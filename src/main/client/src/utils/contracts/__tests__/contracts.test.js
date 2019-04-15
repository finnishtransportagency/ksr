import {
    contractListTexts, getAttribute, getContractLayers, getFeatureAttributes,
} from '../contracts';

describe('contracts', () => {
    it('contractListTexts - should return array with correct values', () => {
        const contracts = {
            features: [
                {
                    attributes: {
                        contractId: 123,
                        contractDescription: 'Test description.',
                        alfrescoLinkField: '/alfrescourl/123',
                        caseManagementLinkField: '/casemanagementurl/123',
                    },
                },
                {
                    attributes: {
                        contractId: 456,
                        contractDescription: 'Test description 2.',
                        alfrescoLinkField: '/alfrescourl/456',
                        caseManagementLinkField: '/casemanagementurl/456',
                    },
                },
            ],
        };
        const contractIdField = 'contractId';
        const contractDescriptionField = 'contractDescription';
        const alfrescoLinkField = 'alfrescoLinkField';
        const caseManagementLinkField = 'caseManagementLinkField';

        const expectedResult = [
            {
                id: 123,
                description: 'Test description.',
                alfrescoUrl: 'https://extranet.liikennevirasto.fi/share/page/site/vuokravalvonta/dp/ws/faceted-search#searchTerm=/alfrescourl/123&scope=vuokravalvonta&sortField=null',
                attributes: {
                    alfrescoLinkField: '/alfrescourl/123',
                    caseManagementLinkField: '/casemanagementurl/123',
                    contractDescription: 'Test description.',
                    contractId: 123,
                },
                caseManagementUrl: 'https://asianhallinta.liikennevirasto.fi/group/asianhallinta/haku#/?q=/casemanagementurl/123',
            },
            {
                id: 456,
                description: 'Test description 2.',
                alfrescoUrl: 'https://extranet.liikennevirasto.fi/share/page/site/vuokravalvonta/dp/ws/faceted-search#searchTerm=/alfrescourl/456&scope=vuokravalvonta&sortField=null',
                attributes: {
                    alfrescoLinkField: '/alfrescourl/456',
                    caseManagementLinkField: '/casemanagementurl/456',
                    contractDescription: 'Test description 2.',
                    contractId: 456,
                },
                caseManagementUrl: 'https://asianhallinta.liikennevirasto.fi/group/asianhallinta/haku#/?q=/casemanagementurl/456',
            },
        ];

        expect(contractListTexts(
            contracts,
            contractIdField,
            contractDescriptionField,
            alfrescoLinkField,
            caseManagementLinkField,
        )).toEqual(expectedResult);
    });

    it('contractListTexts - should return empty array', () => {
        const contracts = {
            features: [],
        };
        const contractIdField = 'contractId';
        const contractDescriptionField = 'contractDescription';
        const alfrescoLinkField = 'alfrescoLinkField';
        const caseManagementLinkField = 'caseManagementLinkField';

        const contracts2 = null;

        expect(contractListTexts(
            contracts,
            contractIdField,
            contractDescriptionField,
            alfrescoLinkField,
            caseManagementLinkField,
        )).toEqual([]);
        expect(contractListTexts(
            contracts2,
            contractIdField,
            contractDescriptionField,
            alfrescoLinkField,
            caseManagementLinkField,
        )).toEqual([]);
    });

    it('getContractLayers - should work correctly with relation type one', () => {
        const layerList = [
            { id: '1', relationLayerId: '10', relationType: 'one' },
            { id: '10', relationType: 'one' },
        ];

        const expectedResult = {
            currentLayer: { id: '1', relationLayerId: '10', relationType: 'one' },
            contractLayer: { id: '10', relationType: 'one' },
        };

        expect(getContractLayers('1', layerList)).toEqual(expectedResult);
    });

    it('getContractLayers - should work correctly with relation type many', () => {
        const layerList = [
            { id: '1', relationLayerId: '10', relationType: 'many' },
            { id: '10', relationLayerId: '11', relationType: 'link' },
            { id: '11', relationType: 'many' },
        ];

        const expectedResult = {
            currentLayer: { id: '1', relationLayerId: '10', relationType: 'many' },
            contractLayer: { id: '11', relationType: 'many' },
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
            name: 'idField', label: 'idField', value: '123456', hidden: false,
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
        const activeFeature = { layerName: 'Layer 1', layerId: '123', featureId: 123 };

        const expectedValue = [['idField', 123], ['name2', 'Value 2'], ['name3', 1000]];
        expect(getFeatureAttributes(layer, contractDetails, activeFeature)).toEqual(expectedValue);
    });
});
