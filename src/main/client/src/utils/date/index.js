// @flow
import { lightFormat, isValid } from 'date-fns';

/**
 * Converts a date-like object into a Date -object if possible.
 *
 * @param {any} dt Date or date-like object to be converted.
 * @returns {?Date} Date if input can be converted into valid Date otherwise null.
*/
const toDate = (dt: any) => {
    if (!dt) {
        return null;
    }
    const date = new Date(dt);
    return isValid(date) ? date : null;
};

/**
 * Internal method to format date-like object according to given pattern.
 *
 * This method should not be exposed via public API.
 *
 * @param {any} dt Date or date-like object whose Finish presentation to get.
 * @param {string} pattern date-fns compatible formatting pattern.
 *
 * @returns {?string} Formatted date if applicable otherwise empty string.
 */
const display = (dt: any, pattern: string) => {
    const date = toDate(dt);
    return date ? lightFormat(date, pattern) : '';
};

/**
 * Returns a date-like object formatted according to Finnish date standards.
 *
 * @param {any} dt Date or date-like object whose Finnish presentation to get.
 *
 * @returns {?string} Formatted date if applicable otherwise empty string.
 */
export const toDisplayDate = (dt: any): string => display(dt, 'd.M.yyyy');

/**
 * Returns a date-like object formatted according to Finnish datetime standards.
 *
 * @param {any} dt Date or date-like object whose Finnish presentation to get.
 *
 * @returns {?string} Formatted date if applicable otherwise empty string.
 */
export const toDisplayDateTime = (dt: any): string => display(dt, 'd.M.yyyy HH:mm:ss');

/**
 * Returns a date-like object formatted according to ISO 8601 date (ignores time).
 *
 * @param {any} dt Date or date-like object whose ISO 8601 presentation to get.
 *
 * @returns {?string} Formatted date if applicable otherwise empty string.
 */
export const toISODate = (dt: any): string => display(dt, 'yyyy-MM-dd');

/**
 * Returns Unix time in milliseconds for value if it can be converted to Date.
 *
 * @param {any} dt Date or date-like object whose Unix time (ms) to get.
 *
 * @returns {?number} Unix time (ms) if applicable otherwise null.
 */
export const toUnixTime = (dt: any): null | number => {
    const date = toDate(dt);
    return date ? date.getTime() : null;
};
