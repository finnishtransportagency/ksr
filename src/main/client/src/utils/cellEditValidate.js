// @flow

import { toUnixTime } from './date';

/**
* Returns matching edit from edited array.
*
* @param {Object[]} edited Array of edits.
* @param {string} title Title of the attribute.
*
* @returns {Object} Matching row.
*/
const getEdit = (edited: any, title: any) => edited.find(d => d.title === title);

/**
* Returns boolean indicating if there are any edits with given title.
*
* @param {Object[]} edited Array of edits.
* @param {string} title Title of the attribute.
*
* @returns {boolean} Boolean indicating if any edits exist.
*/
const isNewEdit = (edited: any, title: any) => getEdit(edited, title) === undefined;

/**
* Check if values are equal.
* String values are considered equal if a is null or undefined and b is empty string and vice versa.
*
* @param {any} a The value to check equality against.
* @param {any} b The value whose equality to check against a.
*
* @returns {boolean} Boolean indicating if values are equal.
*/
export const equals = (a: any, b: any): boolean => {
    const aClean = typeof a === 'string' ? a.trim() : a;
    const bClean = typeof b === 'string' ? b.trim() : b;

    if (aClean === '' && (bClean === null || bClean === undefined)) {
        return true;
    }
    if ((aClean === null || aClean === undefined) && bClean === '') {
        return true;
    }
    return aClean === bClean;
};

/**
* Adds or updates edited value into edits-Array.
*
* @param {Object[]} edited Array of edited values.
* @param {string} title Column title.
* @param {(string | number)} value Current edited value.
* @param {(string | number)} originalData Original value.
*
* @returns {Object[]} New array of edited values.
*/
const addEditedValue = (edited: any, title: any, value: null | number | string, originalData: any) => edited.reduce(
    (acc, cur) => {
        if (equals(cur.originalData, value) && cur.title === title) {
            return acc;
        }
        return acc.concat(cur.title === title ? { ...cur, editedData: value } : { ...cur });
    },
    isNewEdit(edited, title) && !equals(originalData, value) ? [
        {
            title,
            originalData,
            editedData: value,
        },
    ] : [],
);

/**
* Get value of given type.
*
* @param {string} type Value type.
* @param {string} value Value to convert.
*
* @returns {(string | number)} Value converted to corresponding type.
*/
export const getValue = (type: string, value: string): null | number | string => {
    switch (type) {
        case 'esriFieldTypeString':
            return value ? String(value).trim() : null;
        case 'esriFieldTypeSmallInteger':
        case 'esriFieldTypeInteger':
            return Number.isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
        case 'esriFieldTypeDouble':
            return Number.isNaN(parseFloat(value)) ? null : parseFloat(value);
        case 'esriFieldTypeDate':
            return toUnixTime(value);
        default:
            return value;
    }
};

/**
* Returns a new row with changes.
*
* @param {Object} row A row/feature.
* @param {any} value Events targets value.
* @param {Object} cellInfo Table's Cell-object.
* @param {Object} cellField Table's Field-object.
*
* @returns {Object} Row with changes.
*/
const applyChange = (row: any, value: any, cellInfo: any, cellField: any) => {
    const newValue = getValue(
        cellField.type,
        value,
    );
    return {
        ...row,
        [cellInfo.column.id]: newValue,
        _edited: addEditedValue(
            row._edited,
            cellInfo.column.id,
            newValue,
            row[cellInfo.column.id],
        ),
    };
};

/**
 * Does validations about edited cell in table.
 * Either adds new data to editedLayer or removes if original and edited matches.
 *
 * @param {any} value Event's targets value.
 * @param {Object[]} layerData A row/feature array.
 * @param {Object} cellField Table's Cell-object.
 * @param {Object} cellInfo Table's Field-object.
 *
 * @returns {?Object} Changed row if any.
 */
export const cellEditValidate = (
    value: any,
    layerData: Object[],
    cellField: Object,
    cellInfo: Object,
): any | null => {
    if (cellInfo.index < layerData.length) {
        return applyChange(layerData[cellInfo.index], value, cellInfo, cellField);
    }
    return null;
};

/**
 * Prevents some keypresses depending on cell type.
 * Prevents keypress if text will be longer than length in cellField.
 * String cells allow everything.
 * Int cells allow numbers only.
 * Double cells allow numbers and dots.
 *
 * @param {Object} e Edited cells event.
 * @param {Object} cellField Contains info about edited field.
 *
 * @returns method call or null
 */
export const preventKeyPress = (e: Object, cellField: Object): any | null => {
    if (Number.isInteger(cellField.length) && e.target.innerText.length >= cellField.length) {
        return e.preventDefault();
    }
    switch (cellField.type) {
        case 'esriFieldTypeInteger':
        case 'esriFieldTypeSmallInteger':
            if (Number.isNaN(parseInt(e.key, 10)) || e.key === ' '
            || (cellField.type === 'esriFieldTypeInteger'
                    && e.target.innerText.length >= 9)
            || (cellField.type === 'esriFieldTypeSmallInteger'
                    && e.target.innerText.length >= 4)) {
                return e.preventDefault();
            }
            break;
        case 'esriFieldTypeDouble':
            if (e.key !== '.' && (Number.isNaN(parseInt(e.key, 10)) || e.key === ' ')) {
                return e.preventDefault();
            }
            break;
        default:
            break;
    }
    return null;
};
