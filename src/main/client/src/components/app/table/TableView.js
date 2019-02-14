// @flow
import React, { Fragment } from 'react';
import equals from 'nano-equal';
import Table from '../../ui/blocks/Table';
import strings from '../../../translations';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';
import { zoomToFeatures } from '../../../utils/map';

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
                title={strings.reactTable.zoomToSelected}
                tableOpen={isOpen}
                disabled={!geometryDataSelected}
                onClick={
                    geometryDataSelected ? async () => {
                        await zoomToFeatures(view, geometryData);
                    } : null}
            >
                <i className="fas fa-search-plus" />
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
                activeAdminTool &&
                <Fragment>
                    <Table.Button
                        title={strings.reactTable.saveEditedData}
                        tableOpen={isOpen}
                        disabled={
                            !activeUpdate
                            || originalLayers.every(o => o._source === 'shapefile')
                            || !originalLayers.length
                            || equals(originalLayers, editedLayersNoUnderscore)
                        }
                        onClick={
                            activeUpdate
                            && originalLayers.length
                            && !equals(originalLayers, editedLayersNoUnderscore)
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
                    <Table.Button
                        title={strings.reactTable.deleteSelected}
                        tableOpen={isOpen}
                        disabled={!activeDelete || !selectedAdminData}
                        onClick={
                            activeDelete && selectedAdminData ? () => {
                                setActiveModal('deleteSelected');
                            } : null
                        }
                    >
                        <i className="fas fa-eraser" />
                    </Table.Button>
                </Fragment>
            }
        </Table.ButtonWrapper>
        <TabbedTableContainer />
    </Table>
);

export default TableView;
