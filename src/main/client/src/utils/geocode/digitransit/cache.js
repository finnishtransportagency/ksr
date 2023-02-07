// @flow

const cache: Map<string, Object> = new Map();

/**
 * Adds an array of items to cache.
 *
 * Keeps cache size under 100 items. Items are cacheable only if they have
 * a "magicKey" property.
 *
 * @param {Object[]} items Items to put into cache.
 * @returns {Object[]} Array of original items.
 */
export const addToCache = (items: Array<Object>): Array<any> => {
    if (cache.size > 100) {
        cache.clear();
    }
    items.forEach((item) => {
        if (item.magicKey) {
            cache.set(item.magicKey, item);
        }
    });
    return items;
};

export default cache;
