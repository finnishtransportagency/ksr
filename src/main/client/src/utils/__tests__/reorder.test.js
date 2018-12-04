import { reorder, reorderLayers } from '../reorder';

describe('reorder.js', () => {
    it('reorder - should move element within list', () => {
        const list = [1, 2, 3, 4, 5];

        const expectedResult1 = [1, 2, 4, 3, 5];
        const expectedResult2 = [2, 3, 4, 5, 1];
        const expectedResult3 = [1, 4, 2, 3, 5];

        expect(reorder(list, 2, 3)).toEqual(expectedResult1);
        expect(reorder(list, 0, 4)).toEqual(expectedResult2);
        expect(reorder(list, 3, 1)).toEqual(expectedResult3);
    });

    it('reorderLayers - mixed active - should reorder layers correctly', () => {
        const foundLayer = { id: '4' };
        const layerGroups = [{
            layers: [
                { id: '1', layerOrder: 1 },
                { id: '2', layerOrder: 2 },
                { id: '3', layerOrder: 3 },
            ],
        }, {
            layers: [
                { id: '4', layerOrder: 4 },
                { id: '5', layerOrder: 5 },
                { id: '6', layerOrder: 6 },
            ],
        }];
        const layerList = [
            { id: '5', active: false },
            { id: '1', active: false },
            { id: '2', active: false },
            { id: '3', active: true },
            { id: '6', active: true },
            { id: '4', active: true },
        ];

        const expectedResult = [
            { id: '5', active: false },
            { id: '1', active: false },
            { id: '2', active: false },
            { id: '4', active: true },
            { id: '3', active: true },
            { id: '6', active: true },
        ];

        expect(reorderLayers(layerGroups, layerList, foundLayer)).toEqual(expectedResult);
    });

    it('reorderLayers - all active - should reorder layers correctly', () => {
        const foundLayer = { id: '4' };
        const layerGroups = [{
            layers: [
                { id: '1', layerOrder: 1 },
                { id: '2', layerOrder: 2 },
                { id: '3', layerOrder: 3 },
            ],
        }, {
            layers: [
                { id: '4', layerOrder: 4 },
                { id: '5', layerOrder: 5 },
                { id: '6', layerOrder: 6 },
            ],
        }];
        const layerList = [
            { id: '5', active: true },
            { id: '1', active: true },
            { id: '2', active: true },
            { id: '3', active: true },
            { id: '6', active: true },
            { id: '4', active: true },
        ];

        const expectedResult = [
            { id: '5', active: true },
            { id: '4', active: true },
            { id: '1', active: true },
            { id: '2', active: true },
            { id: '3', active: true },
            { id: '6', active: true },
        ];

        expect(reorderLayers(layerGroups, layerList, foundLayer)).toEqual(expectedResult);
    });

    it('reorderLayers - lowest value - should place layer as last index', () => {
        const foundLayer = { id: '1' };
        const layerGroups = [{
            layers: [
                { id: '1', layerOrder: 1 },
                { id: '2', layerOrder: 2 },
                { id: '3', layerOrder: 3 },
            ],
        }, {
            layers: [
                { id: '4', layerOrder: 4 },
                { id: '5', layerOrder: 5 },
                { id: '6', layerOrder: 6 },
            ],
        }];
        const layerList = [
            { id: '5', active: true },
            { id: '1', active: true },
            { id: '2', active: false },
            { id: '3', active: true },
            { id: '4', active: true },
            { id: '6', active: true },
        ];

        const expectedResult = [
            { id: '5', active: true },
            { id: '2', active: false },
            { id: '3', active: true },
            { id: '4', active: true },
            { id: '6', active: true },
            { id: '1', active: true },
        ];

        expect(reorderLayers(layerGroups, layerList, foundLayer)).toEqual(expectedResult);
    });
});
