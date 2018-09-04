// @flow
import React from 'react';
import strings from '../../../../translations';
import ModalContainer from '../../shared/Modal/ModalContainer';

type Props = {
    layerId: string,
    removeUserLayerConfirmed: Function,
    layerList: Array<Object>,
};

const ModalRemoveUserLayer = ({ layerId, removeUserLayerConfirmed, layerList }: Props) => (
    <ModalContainer
        title={strings.modalRemoveUserLayer.title}
        handleModalSubmit={() => removeUserLayerConfirmed(layerId, layerList)}
        submitText={strings.modalRemoveUserLayer.submit}
        cancelText={strings.modalRemoveUserLayer.cancel}
    >
        {strings.modalRemoveUserLayer.content}
    </ModalContainer>
);

export default ModalRemoveUserLayer;
