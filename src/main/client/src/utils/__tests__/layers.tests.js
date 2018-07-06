import { addOrReplaceLayer } from '../layers';

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
});
