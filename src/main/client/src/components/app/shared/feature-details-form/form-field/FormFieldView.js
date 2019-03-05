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

const FormFieldView = ({
    index, field, handleOnChange, fetching, valid, disabled,
}: Props) => (
    <Fragment>
        <label
            htmlFor={index}
        >
            {field.label}
            {(!field.nullable)
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
                            : null
                        }
                        data-balloon-pos="left"
                        data-balloon-length="large"
                    >
                        {(!fetching && valid) && field.data.trim().length > 0 && <i className="fas fa-check" />}
                        {((!fetching && !valid) || (field.data.trim().length === 0)) && <i className="fas fa-exclamation-triangle" />}
                        <LoadingIcon size={7} loading={fetching} />
                    </InputInfo>
                </InputWithIcon>
            )}
            {field.nullable
            && (
                <FieldInputView
                    field={field}
                    handleOnChange={handleOnChange}
                    index={index}
                    disabled={disabled}
                />
            )
            }
        </label>
    </Fragment>
);

export default FormFieldView;