// @flow
import React from 'react';
import FormFieldView from './form-field/FormFieldView';
import { nestedVal } from '../../../../utils/nestedValue';

type Props = {
    fields: Array<Object>,
    handleOnChange: Function,
    requiredUniqueFields: Object[],
};

function FeatureDetailsFormView({
    fields, handleOnChange, requiredUniqueFields,
}: Props): React$Element<"form"> {
    return (
        <form>
            {fields && fields.filter(field => !field.hidden && !field.nullable).map((field, i) => (
                <FormFieldView
                    key={field.value}
                    index={i}
                    field={field}
                    handleOnChange={handleOnChange}
                    fetching={nestedVal(requiredUniqueFields
                        .find(reqUniqueField => reqUniqueField.name === field.name), ['fetching'])}
                    valid={nestedVal(requiredUniqueFields
                        .find(reqUniqueField => reqUniqueField.name === field.name), ['valid'])}
                    disabled={requiredUniqueFields
                        .filter(reqUniqueField => reqUniqueField.name !== field.name)
                        .some(reqUniqueField => reqUniqueField.fetching)}
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
                    disabled={requiredUniqueFields
                        .filter(reqUniqueField => reqUniqueField.name !== field.name)
                        .some(reqUniqueField => reqUniqueField.fetching)}
                />
            ))}
        </form>
    );
}

export default FeatureDetailsFormView;
