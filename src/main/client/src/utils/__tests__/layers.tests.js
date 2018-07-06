import { addOrReplaceLayer, addOrReplaceLayerInSearchGroup } from '../layers';

describe('layers', () => {
    it('addOrReplaceLayer', () => {
        const layerList = [{ id: 1, v: 1 }, { id: 2, v: 2 }, { id: 3, v: 3 }];

        const layer1 = { id: 3, v: 4 };
        const expected1 = [{ id: 1, v: 1 }, { id: 2, v: 2 }, { id: 3, v: 4 }];

        const layer2 = { id: 8, v: 8 };
        const expected2 = [{ id: 8, v: 8 }, { id: 1, v: 1 }, { id: 2, v: 2 }, { id: 3, v: 3 }];

        expect(addOrReplaceLayer(layerList, layer1)).toEqual(expect.arrayContaining(expected1));
        expect(addOrReplaceLayer(layerList, layer2)).toEqual(expect.arrayContaining(expected2));
    });

    it('addOrReplaceLayerInSearchGroup', () => {
        const layerGroups1 = [
            { id: 1 },
            { id: 2, type: 'search', layers: [{ id: 1, v: 1 }] },
        ];
        const layerGroups2 = [{ id: 1 }];

        const layer1 = { id: 1, v: 2 };
        const layer2 = { id: 2, v: 2 };

        const expected1 = [
            { id: 1 },
            { id: 2, type: 'search', layers: [{ id: 1, v: 2 }] },
        ];

        const expected2 = [
            { id: 1 },
            { id: 2, type: 'search', layers: [{ id: 2, v: 2 }, { id: 1, v: 1 }] },
        ];

        const res1 = addOrReplaceLayerInSearchGroup(layerGroups1, layer1);
        const res2 = addOrReplaceLayerInSearchGroup(layerGroups1, layer2);
        const res3 = addOrReplaceLayerInSearchGroup(layerGroups2, layer1);

        expect(res1).toEqual(expect.arrayContaining(expected1));
        expect(res2).toEqual(expect.arrayContaining(expected2));
        expect(res3).toEqual(expect.arrayContaining(layerGroups2));
    });
});
