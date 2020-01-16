// @flow
import React from 'react';
import Table from '../../../ui/blocks/Table';
import AllLayersView from './all-layers/AllLayersView';
import ActiveLayerView from './active-layer/ActiveLayerView';
import AdminLayerView from './admin-layer/AdminLayerView';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    setActiveModal: (modal: string) => void,
    activeUpdate: boolean,
    activeDelete: boolean,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
    editedLayersNoUnderscore: Array<Object>,
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
};

const TableButtonsView = ({
    toggleTable,
    isOpen,
    setActiveModal,
    activeUpdate,
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
    editedLayersNoUnderscore,
    activeAdminTool,
    currentTabAdmin,
}: Props) => (
    <Table.ButtonWrapper tableOpen={isOpen} id="table-button--wrapper">
        <Table.Button
            toggleButton
            onClick={() => {
                toggleTable();
            }}
        >
            <i className={isOpen ? 'fas fa-angle-down' : 'fas fa-angle-up'} />
        </Table.Button>
        <AllLayersView
            isOpen={isOpen}
            setActiveModal={setActiveModal}
            originalLayers={originalLayers}
            geometryData={geometryData}
            showConfirmModal={showConfirmModal}
            clearTableData={clearTableData}
            view={view}
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
                activeUpdate={activeUpdate}
                activeDelete={activeDelete}
                originalLayers={originalLayers}
                editedLayers={editedLayers}
                editedLayersNoUnderscore={editedLayersNoUnderscore}
                selectedAdminData={selectedAdminData}
                showConfirmModal={showConfirmModal}
                saveEditedFeatures={saveEditedFeatures}
                featureType={featureType}
                addressField={addressField}
                view={view}
                activeAdminTool={activeAdminTool}
                currentTabAdmin={currentTabAdmin}
            />
        ) : null}
    </Table.ButtonWrapper>
);

export default TableButtonsView;
