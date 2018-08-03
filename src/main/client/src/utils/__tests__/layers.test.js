import { addOrReplaceLayers, addOrReplaceLayersInSearchGroup } from '../layers';

describe('layers', () => {
    it('addOrReplaceLayers', () => {
        const layerList = [{ id: 1, v: 1 }, { id: 2, v: 2 }, { id: 3, v: 3 }];

        const layers1 = [{ id: 3, v: 4 }];
        const expected1 = [{ id: 1, v: 1 }, { id: 2, v: 2 }, { id: 3, v: 4 }];

        const layers2 = [{ id: 8, v: 8 }, { id: 2, v: 5 }];
        const expected2 = [{ id: 8, v: 8 }, { id: 1, v: 1 }, { id: 2, v: 5 }, { id: 3, v: 3 }];

        expect(addOrReplaceLayers(layerList, layers1)).toEqual(expect.arrayContaining(expected1));
        expect(addOrReplaceLayers(layerList, layers2)).toEqual(expect.arrayContaining(expected2));
    });

    it('addOrReplaceLayersInSearchGroup', () => {
        const layerGroups1 = [
            { id: 1 },
            { id: 2, type: 'search', layers: [{ id: 1, v: 1 }] },
        ];
        const layerGroups2 = [{ id: 1 }];

        const layers1 = [{ id: 1, v: 2 }];
        const layers2 = [{ id: 2, v: 2 }, { id: 3, v: 3 }];

        const expected1 = [
            { id: 1 },
            { id: 2, type: 'search', layers: [{ id: 1, v: 2 }] },
        ];

        const expected2 = [
            { id: 1 },
            { id: 2, type: 'search', layers: [{ id: 3, v: 3 }, { id: 2, v: 2 }, { id: 1, v: 1 }] },
        ];

        const res1 = addOrReplaceLayersInSearchGroup(layerGroups1, layers1);
        const res2 = addOrReplaceLayersInSearchGroup(layerGroups1, layers2);
        const res3 = addOrReplaceLayersInSearchGroup(layerGroups2, layers1);

        expect(res1).toEqual(expect.arrayContaining(expected1));
        expect(res2).toEqual(expect.arrayContaining(expected2));
        expect(res3).toEqual(expect.arrayContaining(layerGroups2));
    });
});
