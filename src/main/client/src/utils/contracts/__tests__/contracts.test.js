import { contractListTexts, getRelationLayers } from '../contracts';

describe('contracts', () => {
    it('contractListTexts - should return array with id and description', () => {
        const contracts = {
            features: [
                {
                    attributes: {
                        contractId: 123,
                        contractDescription: 'Test description.',
                    },
                },
                {
                    attributes: {
                        contractId: 456,
                        contractDescription: 'Test description 2.',
                    },
                },
            ],
        };
        const contractIdField = 'contractId';
        const contractDescriptionField = 'contractDescription';

        const expectedResult = [
            {
                id: 123,
                description: 'Test description.',
            },
            {
                id: 456,
                description: 'Test description 2.',
            },
        ];

        expect(contractListTexts(contracts, contractIdField, contractDescriptionField))
            .toEqual(expectedResult);
    });

    it('contractListTexts - should return empty array', () => {
        const contracts = {
            features: [],
        };
        const contractIdField = 'contractId';
        const contractDescriptionField = 'contractDescription';

        const contracts2 = null;

        expect(contractListTexts(contracts, contractIdField, contractDescriptionField))
            .toEqual([]);
        expect(contractListTexts(contracts2, contractIdField, contractDescriptionField))
            .toEqual([]);
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
