// @flow

/**
 * Safely access deeply nested values without having to check each value individually.
 * If any of the checked values doesn't exist, null will be returned.
 *
 * @example
 * // returns 123
 * const obj = { user: { details: { id: 123 } } };
 * const list = ['details', 'id'];
 * nestedVal(obj, list)
 *
 * @example
 * // returns null
 * const obj = { user: { details: { id: 123 } } };
 * const list = ['doesntexist', 'id'];
 * nestedVal(obj, list)
 *
 * @param {Object} obj Object containing deeply nested values.
 * @param {string[]} list List of nested values to find in object.
 *
 * @returns {any} Found nested value or null.
 */
export const nestedVal = (obj: ?Object, list: string[]): any =>
    (list instanceof Array && obj instanceof Object
        ? list.reduce((val, next) => ((val && val[next]) ? val[next] : null), obj)
        : null);
