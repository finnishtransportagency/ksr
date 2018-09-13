// @flow
import React from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';

type Props = {
    view: Object,
    editedLayers: Array<Object>,
    saveEditedFeatures: Function,
};

const ModalSaveEditedData = ({ view, editedLayers, saveEditedFeatures }: Props) => (
    <ModalContainer
        title={strings.modalSaveEditedData.title}
        handleModalSubmit={() => saveEditedFeatures(view, editedLayers)}
        submitText={strings.modalSaveEditedData.submit}
        cancelText={strings.modalSaveEditedData.cancel}
    >
        {strings.modalSaveEditedData.content}
    </ModalContainer>
);

export default ModalSaveEditedData;
