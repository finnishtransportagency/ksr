import { contractListTexts, getRelationLayers } from '../contracts';

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

    it('getRelationLayers - should work correctly with relation type one', () => {
        const currentLayer = {
            id: 123,
            relationType: 'one',
        };
        const relationLayer = {
            relationLayerId: 456,
        };

        const expectedResult = {
            layerToQuery: relationLayer.id,
            layerToUpdate: currentLayer,
        };

        expect(getRelationLayers(currentLayer, relationLayer))
            .toEqual(expectedResult);
    });

    it('getRelationLayers - should work correctly with relation type many', () => {
        const currentLayer = {
            id: 123,
            relationType: 'many',
        };
        const relationLayer = {
            relationLayerId: 456,
        };

        const expectedResult = {
            layerToQuery: relationLayer.relationLayerId,
            layerToUpdate: relationLayer,
        };

        expect(getRelationLayers(currentLayer, relationLayer))
            .toEqual(expectedResult);
    });
});
