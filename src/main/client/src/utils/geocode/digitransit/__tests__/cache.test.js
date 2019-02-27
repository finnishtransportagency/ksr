import cache, { addToCache } from '../cache';

describe('digitransit - cache', () => {
    it('cache should be a Map', () => {
        expect(cache instanceof Map).toBeTruthy();
    });

    it('adds items to cache', () => {
        cache.clear();
        const items = [
            { magicKey: '123', value: 'a' },
            { magicKey: '124', value: 'b' },
            { key: '125', value: 'c' },
            { magicKey: '126', value: 'd' },
        ];

        addToCache(items);
        expect(cache.size).toBe(3);
        expect(cache.get('123')).toMatchObject({ magicKey: '123', value: 'a' });
        expect(cache.get('124')).toMatchObject({ magicKey: '124', value: 'b' });
        expect(cache.get('126')).toMatchObject({ magicKey: '126', value: 'd' });
    });
});
