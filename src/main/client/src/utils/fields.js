// @flow
import { nestedVal } from './nestedValue';
import store from '../store';

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

/**
 * Finds domain field values for child layers that are created from multiple different layers.
 *
 * @param {Object} childField Field that domain values are searched for.
 *
 * @returns {Object} Field with found domain values or field's domain as null.
 */
export const childLayerDomainValues = (childField: Object) => {
    if (childField.domain !== null) return childField;

    const { layerList } = store.getState().map.layerGroups;
    const domainFields = layerList.filter(layer => layer.fields)
        .flatMap(layer => layer.fields)
        .filter(field => field.domain);

    return {
        ...childField,
        domain: nestedVal(
            domainFields.find(field => childField.name === field.name),
            ['domain'],
        ),
    };
};
