// @flow
import React, { Fragment } from 'react';
import { TextInput } from '../../../ui/elements';
import strings from '../../../../translations';

type Props = {
    handleTextChange: Function,
};

function ModalDrawTextView({ handleTextChange }: Props) {
    return (
        <>
            <label htmlFor="modalDrawTextInput" />
            {strings.modalDrawText.inputLabel}
            <TextInput
                backgroundDarker
                index="modalDrawTextInput"
                type="text"
                placeholder={strings.modalDrawText.inputPlaceholder}
                onChange={handleTextChange}
            />
        </>
    );
}

export default ModalDrawTextView;
