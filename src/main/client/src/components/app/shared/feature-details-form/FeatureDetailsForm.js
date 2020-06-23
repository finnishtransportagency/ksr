// @flow
import React, { useEffect, useState } from 'react';
import { nestedVal } from '../../../../utils/nestedValue';
import FeatureDetailsFormView from './FeatureDetailsFormView';
import { queryFeatures } from '../../../../api/search/searchQuery';
import { abortFetch } from '../../../../utils/abortFetch';
import { toISODate, toUnixTime } from '../../../../utils/date';
import { fieldEdited } from '../../../../utils/contracts/contracts';

type Props = {
    layer: Object,
    setFormOptions: (formOptions: Object) => void,
    formType: string,
    existingAttributes?: Object,
};

let controller;
let signal;
let existsQuery;
const FeatureDetailsForm = (props: Props) => {
    const {
        layer, setFormOptions, formType, existingAttributes,
    } = props;

    const [fields, setFields] = useState([]);
    const [requiredFields, setRequiredFields] = useState([]);
    const [requiredUniqueFields, setRequiredUniqueFields] = useState([]);
    const [validForm, setValidForm] = useState(false);

    /**
     * Gets form fields for the layer when component mounts.
     *
     * If new feature being added, all fields should be empty and not-nullable values
     * should be visible.
     *
     * If existing feature being edited, existing attributes should be added to the
     * corresponding field and not-nullable values should be hidden.
     * Adding hidden value to the field instead of filtering fields out will keep original values
     * like 'objectid' that will be used for updating existing feature.
     */
    useEffect(() => {
        const relationColumnOut = nestedVal(layer.relations.find(c => c), ['relationColumnOut'], '');
        const foundFields = layer.fields
            .map(field => ({
                ...field,
                nullable: layer.requiredUniqueFields
                    .some(uniqueField => uniqueField === field.name)
                || field.name === layer.contractIdField
                    ? false
                    : field.nullable,
                data: nestedVal(existingAttributes, [field.name], ''),
                edited: false,
                unique: layer.requiredUniqueFields.some(uniqueField => uniqueField === field.name),
            }))
            .map(field => ({
                ...field,
                hidden: field.type === 'esriFieldTypeOID'
                    || !field.editable
                    || field.name === layer.updaterField
                    || field.name === 'CONTRACT_UUID'
                    || (layer.contractIdField !== relationColumnOut
                        && relationColumnOut === field.name)
                    || (formType === 'edit'
                        && field.unique),
            }))
            .map((field) => {
                if (field.type === 'esriFieldTypeDate') {
                    return {
                        ...field,
                        data: toISODate(field.data),
                    };
                }
                return field;
            });

        setFields(foundFields);

        const foundRequiredUniqueFields = foundFields.filter(field => field.unique)
            .map(field => ({
                name: field.name,
                fetching: false,
                valid: false,
            }));

        const foundRequiredFields = foundFields.filter(field => !field.nullable && !field.hidden)
            .filter(field => !field.unique)
            .map(field => ({
                name: field.name,
                valid: !!(field.data && field.data.length > 0),
            }));

        setRequiredFields(foundRequiredFields);
        setRequiredUniqueFields(foundRequiredUniqueFields);

        if (!foundRequiredFields.length && !foundRequiredUniqueFields.length) setValidForm(true);

        return () => setFormOptions({
            editedFields: {},
            submitDisabled: false,
        });
    }, []);

    /** Sends form options back to the original layer */
    useEffect(() => {
        if (fields.length) {
            const editedFields = fields.filter(field => field.edited)
                .reduce((acc, field) => {
                    const isDate = field.type === 'esriFieldTypeDate';
                    return { ...acc, [field.name]: isDate ? toUnixTime(field.data) : field.data };
                }, {});

            const objectIdField = fields.find(field => field.type === 'esriFieldTypeOID');
            setFormOptions({
                editedFields: objectIdField && formType === 'edit'
                    ? { ...editedFields, [objectIdField.name]: objectIdField.data }
                    : { ...editedFields },
                submitDisabled: formType === 'edit'
                    ? (!Object.entries(editedFields).length || !validForm)
                    : !validForm,
            });
        }
    }, [fields, validForm]);

    /** Update validForm when any of the required field's changes */
    useEffect(() => {
        if (formType === 'edit') {
            setValidForm(
                requiredFields.every(reqField => reqField.valid),
            );
        } else if (requiredFields.length || requiredUniqueFields.length) {
            const requiredUniqueContainsEmptyValue = requiredUniqueFields
                .some((reqUniqField) => {
                    const foundField = fields.find(field => field.name === reqUniqField.name);
                    return foundField && foundField.data === '';
                });

            setValidForm(
                (requiredFields.every(reqField => reqField.valid)
                    && requiredUniqueFields.every(reqField => reqField.valid))
                && !requiredUniqueContainsEmptyValue,
            );
        }
    }, [requiredFields, requiredUniqueFields]);

    /**
     * Handles input change. If field is not nullable, input will use validation that checks if the
     * field's value is unique.
     *
     * @param {Object} evt Input event with name and value.
     * @param {Object} field The input's attribute field.
     */
    const handleOnChange = async (evt: Object, field: Object) => {
        const { name, value } = evt.target;

        setFields(fields.map(f => ({
            ...f,
            data: f.name === name ? value : f.data,
            edited: fieldEdited(f, name, existingAttributes, value),
        })));

        if (!field.nullable) {
            if (field.unique) {
                if (value && value.trim().length) {
                    setRequiredUniqueFields(requiredUniqueFields.map((reqUniqueField) => {
                        if (reqUniqueField.name === field.name) {
                            return {
                                ...reqUniqueField,
                                fetching: true,
                                valid: false,
                            };
                        }

                        return reqUniqueField;
                    }));

                    window.clearTimeout(existsQuery);
                    ({ controller, signal } = abortFetch(controller));
                    existsQuery = setTimeout(async () => {
                        const res = await queryFeatures(
                            layer.id,
                            `${field.name} = '${value}'`,
                            signal,
                        );

                        if (res) {
                            if ((res.features && res.features.length) || res.error) {
                                setRequiredUniqueFields(requiredUniqueFields.map((reqField) => {
                                    if (reqField.name === field.name) {
                                        return {
                                            ...reqField,
                                            fetching: false,
                                            valid: false,
                                        };
                                    }

                                    return reqField;
                                }));
                            } else {
                                setRequiredUniqueFields(requiredUniqueFields.map((reqField) => {
                                    if (reqField.name === field.name) {
                                        return {
                                            ...reqField,
                                            fetching: false,
                                            valid: true,
                                        };
                                    }

                                    return reqField;
                                }));
                            }
                        }
                    }, 300);
                } else {
                    setRequiredUniqueFields(requiredUniqueFields.map((reqUniqueField) => {
                        if (reqUniqueField.name === field.name) {
                            return {
                                ...reqUniqueField,
                                fetching: false,
                                valid: false,
                            };
                        }

                        return reqUniqueField;
                    }));
                }
            } else if (value && value.trim().length) {
                setRequiredFields(requiredFields.map((reqField) => {
                    if (reqField.name === field.name) {
                        return {
                            ...reqField,
                            valid: true,
                        };
                    }

                    return reqField;
                }));
            } else {
                setRequiredFields(requiredFields.map((reqField) => {
                    if (reqField.name === field.name) {
                        return {
                            ...reqField,
                            valid: false,
                        };
                    }

                    return reqField;
                }));
            }
        }
    };

    return (
        <FeatureDetailsFormView
            fields={fields}
            handleOnChange={handleOnChange}
            requiredUniqueFields={requiredUniqueFields}
        />
    );
};

FeatureDetailsForm.defaultProps = {
    existingAttributes: {},
};

export default FeatureDetailsForm;
