// @flow
import React, { Fragment } from 'react';
import { parseColumnType } from '../../../../../utils/type';
import { TextInput } from '../../../../ui/elements';

type Props = {
    index: number,
    field: Object,
    handleOnChange: Function,
};

const ModalLayerDetailsSingleView = ({
    index, field, handleOnChange,
}: Props) => (
    <Fragment>
        <label
            htmlFor={index}
        >{field.name}
            <TextInput
                backgroundDarker
                index={index}
                type={parseColumnType(field.type)}
                onChange={evt => handleOnChange(evt)}
                placeholder=""
                name={field.name}
                autoComplete="off"
                maxLength={field.length}
            />
        </label>
    </Fragment>
);

export default ModalLayerDetailsSingleView;
