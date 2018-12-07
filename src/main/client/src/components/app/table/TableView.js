// @flow
import React from 'react';
import equals from 'nano-equal';
import Table from '../../ui/blocks/Table';
import strings from '../../../translations';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    activeNav: string,
    setActiveModal: (modal: string) => void,
    activeUpdate: boolean,
    activeDelete: boolean,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
    editedLayersNoUnderscore: Array<Object>,
    selectedData: boolean,
    geometryDataSelected: boolean,
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
};

const TableView = ({
    toggleTable,
    isOpen,
    activeNav,
    setActiveModal,
    activeUpdate,
    activeDelete,
    originalLayers,
    editedLayers,
    selectedData,
    geometryDataSelected,
    activeTableDataSelected,
    activeTableLayer,
    showConfirmModal,
    clearTableData,
    saveEditedFeatures,
    featureType,
    addressField,
    view,
    editedLayersNoUnderscore,
}: Props) => (
    <Table
        sideBar={activeNav === 'search' || activeNav === 'mapLayers' || activeNav === 'workspace' || activeNav === 'offline'}
        tableOpen={isOpen}
    >
        <Table.ButtonWrapper tableOpen={isOpen}>
            <Table.Button
                toggleButton
                onClick={() => {
                    toggleTable();
                }}
            >
                <i className={isOpen ? 'fas fa-angle-down' : 'fas fa-angle-up'} />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.filter}
                tableOpen={isOpen}
                disabled={!originalLayers.length}
                onClick={
                    originalLayers.length ? () => {
                        setActiveModal('filter');
                    } : null}
            >
                <i className="fas fa-filter" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.clearTableData}
                tableOpen={isOpen}
                disabled={!originalLayers.length}
                onClick={
                    originalLayers.length ? () => {
                        showConfirmModal(
                            strings.modalClearTable.content,
                            strings.modalClearTable.submit,
                            strings.modalClearTable.cancel,
                            () => {
                                clearTableData();
                                view.popup.close();
                            },
                        );
                    } : null}
            >
                <i className="fas fa-trash" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.bufferSelectedData}
                tableOpen={isOpen}
                disabled={!geometryDataSelected}
                onClick={
                    geometryDataSelected ? () => {
                        setActiveModal('bufferSelectedData');
                    } : null}
            >
                <i className="far fa-dot-circle" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.extractSelectedData}
                tableOpen={isOpen}
                disabled={!activeTableLayer || !geometryDataSelected || !activeTableDataSelected}
                onClick={
                    activeTableLayer && geometryDataSelected && activeTableDataSelected ? () => {
                        setActiveModal('extractSelectedData');
                    } : null}
            >
                <i className="fas fa-file-export" />
            </Table.Button>
            {
                activeUpdate &&
                <Table.Button
                    title={strings.reactTable.saveEditedData}
                    tableOpen={isOpen}
                    disabled={originalLayers.every(o => o._source === 'shapefile') || !originalLayers.length || equals(originalLayers, editedLayersNoUnderscore)}
                    onClick={
                        originalLayers.length && !equals(originalLayers, editedLayersNoUnderscore)
                            ? () => {
                                showConfirmModal(
                                    strings.modalSaveEditedData.content,
                                    strings.modalSaveEditedData.submit,
                                    strings.modalSaveEditedData.cancel,
                                    () => {
                                        saveEditedFeatures(
                                            view,
                                            editedLayers,
                                            featureType,
                                            addressField,
                                        );
                                    },
                                );
                            } : null}
                >
                    <i className="fas fa-save" />
                </Table.Button>
            }
            {
                activeDelete &&
                <Table.Button
                    title={strings.reactTable.deleteSelected}
                    tableOpen={isOpen}
                    disabled={!selectedData}
                    onClick={
                        selectedData ? () => {
                            setActiveModal('deleteSelected');
                        } : null
                    }
                >
                    <i className="fas fa-eraser" />
                </Table.Button>
            }

        </Table.ButtonWrapper>
        <TabbedTableContainer />
    </Table>
);

export default TableView;
