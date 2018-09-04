// @flow
import React, { Fragment } from 'react';
import { TextInput } from '../../../ui/elements';
import strings from '../../../../translations';

type Props = {
    handleBufferChange: Function,
};

const ModalBufferSelectedView = ({ handleBufferChange }: Props) => (
    <Fragment>
        <label
            htmlFor="bufferSelectedView"
        > {strings.modalBufferSelectedData.bufferLabel}
            <TextInput
                backgroundDarker
                index="bufferSelectedView"
                type="number"
                placeholder="0"
                min={0}
                onChange={handleBufferChange}
            />
        </label>


    </Fragment>
);

export default ModalBufferSelectedView;
