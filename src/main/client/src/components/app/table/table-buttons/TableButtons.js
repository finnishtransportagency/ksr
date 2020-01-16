// @flow
import React, { useEffect } from 'react';
import TableButtonsView from './TableButtonsView';

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
    setButtonAmount: (buttonAmount: ?number) => void,
};

const TableButtons = ({
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
    setButtonAmount,
}: Props) => {
    useEffect(() => {
        const tableButtonWrapper = document.getElementById('table-button--wrapper');
        const tableButtonAmount = tableButtonWrapper !== null
            ? tableButtonWrapper.childNodes.length
            : null;

        setButtonAmount(tableButtonAmount);
    }, [currentTabAdmin]);

    return (
        <TableButtonsView
            toggleTable={toggleTable}
            isOpen={isOpen}
            setActiveModal={setActiveModal}
            activeUpdate={activeUpdate}
            activeDelete={activeDelete}
            originalLayers={originalLayers}
            editedLayers={editedLayers}
            editedLayersNoUnderscore={editedLayersNoUnderscore}
            selectedAdminData={selectedAdminData}
            geometryDataSelected={geometryDataSelected}
            geometryData={geometryData}
            activeTableDataSelected={activeTableDataSelected}
            activeTableLayer={activeTableLayer}
            showConfirmModal={showConfirmModal}
            clearTableData={clearTableData}
            saveEditedFeatures={saveEditedFeatures}
            featureType={featureType}
            addressField={addressField}
            view={view}
            activeAdminTool={activeAdminTool}
            currentTabAdmin={currentTabAdmin}
        />
    );
};

export default TableButtons;
