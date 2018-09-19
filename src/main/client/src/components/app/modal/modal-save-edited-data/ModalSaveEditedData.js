// @flow
import React from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';

type Props = {
    view: Object,
    editedLayers: Array<Object>,
    saveEditedFeatures: Function,
    addressField: string,
    featureType: string,
};

const ModalSaveEditedData = ({
    view, editedLayers, saveEditedFeatures, addressField, featureType,
}: Props) => (
    <ModalContainer
        title={strings.modalSaveEditedData.title}
        handleModalSubmit={() => saveEditedFeatures(view, editedLayers, featureType, addressField)}
        submitText={strings.modalSaveEditedData.submit}
        cancelText={strings.modalSaveEditedData.cancel}
    >
        {strings.modalSaveEditedData.content}
    </ModalContainer>
);

export default ModalSaveEditedData;
