import React from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';

function ModalOfflineSavedView() {
    return (
        <ModalContainer
            title={strings.offlineSavedModal.title}
            modalSubmit={[]}
            cancelText={strings.offlineSavedModal.cancel}
        >
            {strings.offlineSavedModal.text}
        </ModalContainer>
    );
}

export default ModalOfflineSavedView;
