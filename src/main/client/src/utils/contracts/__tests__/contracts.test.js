import { contractListTexts, getContractLayers } from '../contracts';

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
                alfrescoUrl: 'https://extranet.liikennevirasto.fi/share/page/dp/ws/faceted-search#searchTerm=/alfrescourl/123',
                caseManagementUrl: 'https://asianhallinta.liikennevirasto.fi/group/asianhallinta/haku#/?q=/casemanagementurl/123',
            },
            {
                id: 456,
                description: 'Test description 2.',
                alfrescoUrl: 'https://extranet.liikennevirasto.fi/share/page/dp/ws/faceted-search#searchTerm=/alfrescourl/456',
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
            contractLinkLayer: null,
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
            contractLinkLayer: { id: '10', relationLayerId: '11', relationType: 'link' },
            contractLayer: { id: '11', relationType: 'many' },
        };

        expect(getContractLayers('1', layerList)).toEqual(expectedResult);
    });
});
