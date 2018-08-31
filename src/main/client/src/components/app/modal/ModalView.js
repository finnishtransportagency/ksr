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
import ModalNewWorkspaceContainer from './modal-new-workspace/ModalNewWorkspaceContainer';

type Props = {
    activeModal: string,
};

const ModalView = ({ activeModal }: Props) => (
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
    </Fragment>
);

export default ModalView;
