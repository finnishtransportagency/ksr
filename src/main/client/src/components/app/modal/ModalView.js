// @flow
import React, { Fragment } from 'react';

import ModalClearTableContainer from './modal-clear-table/ModalClearTableContainer';
import ModalDeleteSelectedContainer from './modal-delete-selected/ModalDeleteSelectedContainer';
import ModalSaveEditedDataContainer from './modal-save-edited-data/ModalSaveEditedDataContainer';
import ModalBufferSelectedContainer from './modal-buffer-selected/ModalBufferSelectedContainer';
import ModalFilterContainer from './modal-filter/ModalFilterContainer';
import ModalAddUserLayerContainer from './modal-add-user-layer/ModalAddUserLayerContainer';
import ModalRemoveUserLayerContainer from './modal-remove-user-layer/ModalRemoveUserLayerContainer';
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
        {activeModal === 'clearTable' && <ModalClearTableContainer />}
        {activeModal === 'deleteSelected' && <ModalDeleteSelectedContainer />}
        {activeModal === 'saveEditedData' && <ModalSaveEditedDataContainer />}
        {activeModal === 'bufferSelectedData' && <ModalBufferSelectedContainer />}
        {activeModal === 'addUserLayer' && <ModalAddUserLayerContainer />}
        {activeModal === 'removeUserLayer' && <ModalRemoveUserLayerContainer />}
        {activeModal === 'editLayerDetails' && <ModalLayerDetailsContainer />}
        {activeModal === 'newWorkspace' && <ModalNewWorkspaceContainer />}
        {activeModal === 'shapefile' && <ModalShapefileContainer />}
        {activeModal === 'drawText' && <ModalDrawTextContainer />}
        {confirmModal && <ConfirmModalContainer />}
    </Fragment>
);

export default ModalView;
