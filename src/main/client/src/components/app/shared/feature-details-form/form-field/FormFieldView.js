// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../translations';
import { InputInfo, InputWithIcon } from '../../../../ui/elements/TextInput';
import LoadingIcon from '../../LoadingIcon';
import FieldInputView from './field-input/FieldInputView';

type Props = {
    index: number,
    field: Object,
    handleOnChange: Function,
    fetching: boolean,
    valid: boolean,
    disabled: boolean
};

function FormFieldView({
    index, field, handleOnChange, fetching, valid, disabled,
}: Props): React$Element<"label"> {
    return (
        <label
            htmlFor={index}
        >
            {field.label}
            {(!field.nullable && field.unique)
            && (
                <InputWithIcon>
                    <FieldInputView
                        field={field}
                        handleOnChange={handleOnChange}
                        index={index}
                        disabled={disabled}
                    />
                    <InputInfo
                        data-balloon={(!fetching && !valid)
                        || (field.data.trim().length === 0)
                            ? `${field.label} ${strings.modalFeatureContracts.addEditContract.contractFound}`
                            : null}
                        data-balloon-pos="left"
                        data-balloon-length="large"
                    >
                        {(!fetching && valid) && field.data.trim().length > 0 && <i className="fas fa-check" />}
                        {((!fetching && !valid) || (field.data.trim().length === 0)) && <i className="fas fa-exclamation-triangle" />}
                        {fetching && <LoadingIcon size={7} loading={fetching} />}
                    </InputInfo>
                </InputWithIcon>
            )}
            {(!field.nullable && !field.unique)
            && (
                <FieldInputView
                    field={field}
                    handleOnChange={handleOnChange}
                    index={index}
                    disabled={disabled}
                />
            )}
            {field.nullable
            && (
                <FieldInputView
                    field={field}
                    handleOnChange={handleOnChange}
                    index={index}
                    disabled={disabled}
                />
            )}
        </label>
    );
}

export default FormFieldView;
