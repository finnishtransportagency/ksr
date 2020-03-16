// @flow
export const notAllowedFields = ['objectid', 'object', 'id', 'fid', 'symbolidentifier',
    'objectid_1', 'contract_uuid', 'shape', 'link_objectid'];

/**
 * Filter not allowed fields from the list.
 *
 * @param {Object[]} fields List of fields.
 *
 * @returns {Object[]} Filtered list of fields or field names.
 */
export const filterNotAllowedFields = (fields: Object[]): Object[] => (
    fields.filter(f => !notAllowedFields.includes(f.name.toString().toLowerCase()))
);
