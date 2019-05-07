// @flow
import React, { Fragment } from 'react';
import { TextInput } from '../../../ui/elements';
import strings from '../../../../translations';

type Props = {
    handleTextChange: Function,
};

const ModalDrawTextView = ({ handleTextChange }: Props) => (
    <Fragment>
        <label htmlFor="modalDrawTextInput" />
        {strings.modalDrawText.inputLabel}
        <TextInput
            backgroundDarker
            index="modalDrawTextInput"
            type="text"
            placeholder={strings.modalDrawText.inputPlaceholder}
            onChange={handleTextChange}
        />
    </Fragment>
);

export default ModalDrawTextView;
