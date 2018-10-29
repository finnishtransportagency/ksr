// @flow
import React, { Fragment } from 'react';

import ModalDeleteSelectedContainer from './modal-delete-selected/ModalDeleteSelectedContainer';
import ModalFeatureContracts from './modal-feature-contracts/ModalFeatureContracts';
import ModalSaveEditedDataContainer from './modal-save-edited-data/ModalSaveEditedDataContainer';
import ModalBufferSelectedContainer from './modal-buffer-selected/ModalBufferSelectedContainer';
import ModalFilterContainer from './modal-filter/ModalFilterContainer';
import ModalAddUserLayerContainer from './modal-add-user-layer/ModalAddUserLayerContainer';
import ModalLayerDetailsContainer from './modal-layer-details/ModalLayerDetailsContainer';
import ModalShapefileContainer from './modal-shapefile/ModalShapefileContainer';
import ModalNewWorkspaceContainer from './modal-new-workspace/ModalNewWorkspaceContainer';
import ConfirmModalContainer from '../shared/confirm-modal/ConfirmModalContainer';
import ModalDrawTextContainer from './modal-draw-text/ModalDrawTextContainer';

type Props = {
    activeModal: string,
    confirmModal: boolean,
};

const ModalView = ({ activeModal, confirmModal }: Props) => (
    <Fragment>
        {activeModal === 'filter' && <ModalFilterContainer />}
        {activeModal === 'deleteSelected' && <ModalDeleteSelectedContainer />}
        {activeModal === 'saveEditedData' && <ModalSaveEditedDataContainer />}
        {activeModal === 'bufferSelectedData' && <ModalBufferSelectedContainer />}
        {activeModal === 'addUserLayer' && <ModalAddUserLayerContainer />}
        {activeModal === 'editLayerDetails' && <ModalLayerDetailsContainer />}
        {activeModal === 'newWorkspace' && <ModalNewWorkspaceContainer />}
        {activeModal === 'shapefile' && <ModalShapefileContainer />}
        {activeModal === 'drawText' && <ModalDrawTextContainer />}
        {activeModal === 'featureContracts' && <ModalFeatureContracts />}
        {confirmModal && <ConfirmModalContainer />}
    </Fragment>
);

export default ModalView;
