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
 * @param {any} [defaultValue] If the resolved value is undefined,
 * the defaultValue is returned in its place.
 *
 * @returns {any} Found nested value or defaultValue.
 */
export const nestedVal = (obj: ?Object, list: string[], defaultValue: any = null): any => (
    list instanceof Array && obj instanceof Object
        ? list.reduce((val: Object, next) => ((val && val[next]) ? val[next] : defaultValue), obj)
        : defaultValue);
