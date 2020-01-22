// @flow
import React, { useEffect, useState } from 'react';
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
    viewGraphics: Object[],
    hasTableEdited: boolean,
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
    viewGraphics,
    hasTableEdited,
}: Props) => {
    const [bufferExists, setBufferExists] = useState(false);

    /** Update redux prop that keeps track of amount of visible buttons on table */
    useEffect(() => {
        const tableButtonWrapper = document.getElementById('table-button--wrapper');
        const tableButtonAmount = tableButtonWrapper !== null
            ? tableButtonWrapper.childNodes.length
            : null;

        setButtonAmount(tableButtonAmount);
    }, [currentTabAdmin]);

    /** Set buffer as existing, if buffer added to the view */
    useEffect(() => {
        setBufferExists(viewGraphics.some(graphic => graphic && graphic.id === 'buffer'));
    }, [viewGraphics.length]);

    /** Remove buffer, if no layers open on table */
    useEffect(() => {
        if (view && originalLayers && originalLayers.length === 0) {
            view.graphics.removeMany(view.graphics.filter(g => g && g.id === 'buffer'));
            setBufferExists(false);
        }
    }, [originalLayers]);

    /** Remove buffer graphics from the view */
    const handleClearBuffer = () => {
        view.graphics.removeMany(view.graphics.filter(g => g && g.id === 'buffer'));
        setBufferExists(false);
    };

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
            bufferExists={bufferExists}
            handleClearBuffer={handleClearBuffer}
            hasTableEdited={hasTableEdited}
        />
    );
};

export default TableButtons;
