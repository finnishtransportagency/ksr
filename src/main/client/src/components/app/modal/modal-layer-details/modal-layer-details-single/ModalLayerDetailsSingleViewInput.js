// @flow
import React from 'react';
import Select from 'react-select';

import { parseColumnType } from '../../../../../utils/type';
import { TextInput } from '../../../../ui/elements';

type Props = {
    field: Object,
    handleOnChange: Function,
    index: number,
};

const ModalLayerDetailsSingleViewInput = ({
    field, handleOnChange, index,
}: Props) => {
    if (
        field.domain &&
        (field.domain.type === 'codedValue' || field.domain.type === 'coded-value')
    ) {
        return (
            <Select
                onBlurResetsInput={false}
                onSelectResetsInput={false}
                options={
                    field.domain.codedValues.map(cv => ({
                        label: cv.name,
                        value: cv.code,
                    }))
                }
                value={field.data ? field.data : ''}
                simpleValue
                name={field.name}
                placeholder=""
                onChange={val => handleOnChange(
                    { target: { value: val, name: field.name } },
                    field,
                )}
            />
        );
    }
    return (
        <TextInput
            backgroundDarker
            index={index}
            type={parseColumnType(field.type)}
            onChange={evt => handleOnChange(evt, field)}
            name={field.name}
            value={field.data ? field.data : ''}
            autoComplete="off"
            maxLength={field.length}
            required={!field.nullable}
        />
    );
};

export default ModalLayerDetailsSingleViewInput;
