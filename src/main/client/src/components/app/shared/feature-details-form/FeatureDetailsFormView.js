// @flow
import React from 'react';
import FormFieldView from './form-field/FormFieldView';
import { nestedVal } from '../../../../utils/nestedValue';

type Props = {
    fields: Array<Object>,
    handleOnChange: Function,
    requiredFields: Object[],
};

const FeatureDetailsFormView = ({
    fields, handleOnChange, requiredFields,
}: Props) => (
    <form>
        {fields && fields.filter(field => !field.hidden && !field.nullable).map((field, i) => (
            <FormFieldView
                key={field.value}
                index={i}
                field={field}
                handleOnChange={handleOnChange}
                fetching={nestedVal(requiredFields.find(reqField => reqField.name === field.name), ['fetching'])}
                valid={nestedVal(requiredFields.find(reqField => reqField.name === field.name), ['valid'])}
                disabled={requiredFields.filter(reqField => reqField.name !== field.name)
                    .some(reqField => reqField.fetching)}
            />
        ))}
        {fields && fields.filter(field => !field.hidden && field.nullable).map((field, i) => (
            <FormFieldView
                key={field.value}
                index={i}
                field={field}
                handleOnChange={handleOnChange}
                fetching={false}
                valid
                disabled={requiredFields.filter(reqField => reqField.name !== field.name)
                    .some(reqField => reqField.fetching)}
            />
        ))}
    </form>
);

export default FeatureDetailsFormView;
