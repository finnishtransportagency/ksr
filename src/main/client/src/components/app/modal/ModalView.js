// @flow
import React, { Fragment } from 'react';

import ModalDeleteSelectedContainer from './modal-delete-selected/ModalDeleteSelectedContainer';
import ModalFeatureContractsContainer from './modal-feature-contracts/ModalFeatureContractsContainer';
import ModalBufferSelectedContainer from './modal-buffer-selected/ModalBufferSelectedContainer';
import ModalExtractSelectedContainer from './modal-extract-selected/ModalExtractSelectedContainer';
import ModalFilterContainer from './modal-filter/ModalFilterContainer';
import ModalAddUserLayerContainer from './modal-add-user-layer/ModalAddUserLayerContainer';
import ModalLayerDetailsContainer from './modal-layer-details/ModalLayerDetailsContainer';
import ModalShapefileContainer from './modal-shapefile/ModalShapefileContainer';
import ModalNewWorkspaceContainer from './modal-new-workspace/ModalNewWorkspaceContainer';
import ConfirmModalContainer from '../shared/confirm-modal/ConfirmModalContainer';
import ModalDrawTextContainer from './modal-draw-text/ModalDrawTextContainer';
import ModalOfflineSavedView from './modal-offline-saved/ModalOfflineSavedView';
import ModalThemeLayerContainer from './modal-theme-layer/ModalThemeLayerContainer';
import ModalContractDetailsContainer from './modal-contract-details/ModalContractDetailsContainer';
import ModalDownloadCsvContainer from './modal-donwload-csv/ModalDownloadCsvContainer';

type Props = {
    activeModal: string,
    confirmModal: boolean,
};

const ModalView = ({ activeModal, confirmModal }: Props) => (
    <Fragment>
        {activeModal === 'filter' && <ModalFilterContainer />}
        {activeModal === 'deleteSelected' && <ModalDeleteSelectedContainer />}
        {activeModal === 'bufferSelectedData' && <ModalBufferSelectedContainer />}
        {activeModal === 'extractSelectedData' && <ModalExtractSelectedContainer />}
        {activeModal === 'addUserLayer' && <ModalAddUserLayerContainer />}
        {activeModal === 'editLayerDetails' && <ModalLayerDetailsContainer />}
        {activeModal === 'newWorkspace' && <ModalNewWorkspaceContainer />}
        {activeModal === 'shapefile' && <ModalShapefileContainer />}
        {activeModal === 'drawText' && <ModalDrawTextContainer />}
        {activeModal === 'featureContracts' && <ModalFeatureContractsContainer />}
        {activeModal === 'offlineSave' && <ModalOfflineSavedView />}
        {activeModal === 'themeLayer' && <ModalThemeLayerContainer />}
        {activeModal === 'contractDetails' && <ModalContractDetailsContainer />}
        {activeModal === 'downloadCSV' && <ModalDownloadCsvContainer />}
        {confirmModal && <ConfirmModalContainer />}
    </Fragment>
);

export default ModalView;
