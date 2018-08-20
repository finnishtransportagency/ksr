// @flow
import React, { Fragment } from 'react';
import { TextInput } from '../../../../../../ui/elements';
import { parseColumnType } from '../../../../../../../utils/parseType';

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
                onChange={evt => handleOnChange(field, evt)}
                placeholder=""
                name={field.name}
                autoComplete="off"
            />
        </label>
    </Fragment>
);

export default ModalLayerDetailsSingleView;
