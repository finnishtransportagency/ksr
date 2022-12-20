// @flow
import React from 'react';
import Select from 'react-select';
import { parseColumnType } from '../../../../../../utils/type';
import { TextInput } from '../../../../../ui/elements';
import { SelectWrapper } from './styles';

type Props = {
    field: Object,
    handleOnChange: Function,
    index: number,
    disabled: boolean,
};

const FieldInputView = ({
    field, handleOnChange, index, disabled,
}: Props) => {
    if (
        field.domain
        && (field.domain.type === 'codedValue' || field.domain.type === 'coded-value')
    ) {
        return (
            <SelectWrapper
                invalid={!field.nullable
                && !field.domain.codedValues.some(codedValue => codedValue.code === field.data)}
                onClick={e => e.preventDefault()}
            >
                <Select
                    onBlurResetsInput={false}
                    onSelectResetsInput={false}
                    options={
                        field.domain.codedValues.map(cv => ({
                            label: cv.name,
                            value: cv.code,
                        }))
                    }
                    value={field.data !== null ? field.data.toString() : ''}
                    simpleValue
                    name={field.name}
                    placeholder=""
                    onChange={val => handleOnChange(
                        { target: { value: val, name: field.name } },
                        field,
                    )}
                />
            </SelectWrapper>
        );
    }
    return (
        <TextInput
            backgroundDarker
            index={index}
            type={parseColumnType(field.type)}
            onChange={evt => handleOnChange(evt, field)}
            name={field.name}
            value={field.data !== null ? field.data.toString() : ''}
            autoComplete="off"
            maxLength={field.length}
            required={!field.nullable}
            disabled={disabled}
            max={field.max}
        />
    );
};

export default FieldInputView;
