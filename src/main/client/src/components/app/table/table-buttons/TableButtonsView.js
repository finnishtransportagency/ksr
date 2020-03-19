// @flow
import React from 'react';
import Table from '../../../ui/blocks/Table';
import AllLayersView from './all-layers/AllLayersView';
import ActiveLayerView from './active-layer/ActiveLayerView';
import AdminLayerView from './admin-layer/AdminLayerView';
import strings from '../../../../translations';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    activeDelete: boolean,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
    selectedAdminData: boolean,
    geometryDataSelected: boolean,
    geometryData: Object[],
    activeTableDataSelected: boolean,
    activeTableLayer: Object,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    clearTableData: Function,
    saveEditedFeatures: Function,
    featureType: string,
    addressField: string,
    view: Object,
    activeAdminTool: string,
    currentTabAdmin: boolean,
    bufferExists: boolean,
    handleClearBuffer: Function,
    hasTableEdited: boolean,
    portalIsOpen: boolean,
    togglePortal: Function,
    updatePortal: Function,
};

const TableButtonsView = ({
    toggleTable,
    isOpen,
    setActiveModal,
    activeDelete,
    originalLayers,
    editedLayers,
    selectedAdminData,
    geometryDataSelected,
    geometryData,
    activeTableDataSelected,
    activeTableLayer,
    showConfirmModal,
    clearTableData,
    saveEditedFeatures,
    featureType,
    addressField,
    view,
    activeAdminTool,
    currentTabAdmin,
    bufferExists,
    handleClearBuffer,
    hasTableEdited,
    portalIsOpen,
    togglePortal,
    updatePortal,
}: Props) => (
    <Table.ButtonWrapper tableOpen={isOpen} id="table-button--wrapper">
        <Table.Button
            toggleButton
            onClick={!portalIsOpen ? () => {
                toggleTable();
                updatePortal();
            } : null}
            disabled={portalIsOpen}
        >
            <i className={isOpen ? 'fas fa-angle-down' : 'fas fa-angle-up'} />
        </Table.Button>
        <Table.Button
            portalButton
            title={strings.reactTable.windowPortal}
            onClick={!portalIsOpen ? () => {
                if (isOpen) {
                    toggleTable();
                }
                togglePortal();
            } : null}
            id="portalButton"
            disabled={portalIsOpen}
        >
            <i className="fas fa-external-link-square-alt" />
        </Table.Button>
        <AllLayersView
            isOpen={isOpen}
            setActiveModal={setActiveModal}
            originalLayers={originalLayers}
            geometryData={geometryData}
            showConfirmModal={showConfirmModal}
            clearTableData={clearTableData}
            view={view}
            bufferExists={bufferExists}
            handleClearBuffer={handleClearBuffer}
        />
        <ActiveLayerView
            isOpen={isOpen}
            setActiveModal={setActiveModal}
            originalLayers={originalLayers}
            geometryDataSelected={geometryDataSelected}
            activeTableDataSelected={activeTableDataSelected}
            activeTableLayer={activeTableLayer}
        />
        {(activeAdminTool && currentTabAdmin) ? (
            <AdminLayerView
                isOpen={isOpen}
                setActiveModal={setActiveModal}
                activeDelete={activeDelete}
                editedLayers={editedLayers}
                selectedAdminData={selectedAdminData}
                showConfirmModal={showConfirmModal}
                saveEditedFeatures={saveEditedFeatures}
                featureType={featureType}
                addressField={addressField}
                view={view}
                activeAdminTool={activeAdminTool}
                currentTabAdmin={currentTabAdmin}
                hasTableEdited={hasTableEdited}
            />
        ) : null}
    </Table.ButtonWrapper>
);

export default TableButtonsView;
