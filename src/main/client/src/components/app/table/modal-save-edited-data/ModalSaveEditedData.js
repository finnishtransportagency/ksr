// @flow
import React from 'react';
import strings from '../../../../translations';
import { saveEditedData } from '../../../../utils/saveEditedData';
import ModalContainer from '../../shared/Modal/ModalContainer';

type Props = {
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
};

const ModalSaveEditedData = ({ originalLayers, editedLayers }: Props) => (
    <ModalContainer
        title={strings.modalSaveEditedData.title}
        handleModalSubmit={() => saveEditedData(originalLayers, editedLayers)}
        submitText={strings.modalSaveEditedData.submit}
        cancelText={strings.modalSaveEditedData.cancel}
    >
        {strings.modalSaveEditedData.content}
    </ModalContainer>
);

export default ModalSaveEditedData;
