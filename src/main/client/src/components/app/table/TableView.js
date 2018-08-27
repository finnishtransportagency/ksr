// @flow
import React from 'react';
import equals from 'nano-equal';
import Table from '../../ui/blocks/Table';
import ModalClearTableContainer from './modal-clear-table/ModalClearTableContainer';
import ModalDeleteSelectedContainer from './modal-delete-selected/ModalDeleteSelectedContainer';
import ModalSaveEditedDataContainer from './modal-save-edited-data/ModalSaveEditedDataContainer';
import ModalBufferSelectedContainer from './modal-buffer-selected/ModalBufferSelectedContainer';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';
import ModalFilterContainer from './modal-filter/ModalFilterContainer';
import strings from '../../../translations';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    activeNav: string,
    setActiveModal: (modal: string) => void,
    activeModal: string,
    adminToolActive: string,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
    selectedData: boolean,
};

const TableView = ({
    toggleTable,
    isOpen,
    activeNav,
    setActiveModal,
    activeModal,
    adminToolActive,
    originalLayers,
    editedLayers,
    selectedData,
}: Props) => (
    <Table sideBar={activeNav === 'search' || activeNav === 'mapLayers'} tableOpen={isOpen}>
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
                        setActiveModal('clearTable');
                    } : null}
            >
                <i className="fas fa-trash" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.saveEditedData}
                tableOpen={isOpen}
                disabled={!originalLayers.length || equals(originalLayers, editedLayers)}
                onClick={
                    originalLayers.length && !equals(originalLayers, editedLayers) ? () => {
                        setActiveModal('saveEditedData');
                    } : null}
            >
                <i className="fas fa-save" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.bufferSelectedData}
                tableOpen={isOpen}
                disabled={!selectedData}
                onClick={
                    selectedData ? () => {
                        setActiveModal('bufferSelectedData');
                    } : null}
            >
                <i className="far fa-dot-circle" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.deleteSelected}
                tableOpen={isOpen && adminToolActive}
                disabled={!selectedData}
                onClick={
                    selectedData ? () => {
                        setActiveModal('deleteSelected');
                    } : null
                }
            >
                <i className="fas fa-eraser" />
            </Table.Button>
        </Table.ButtonWrapper>
        <TabbedTableContainer />
        {activeModal === 'filter' && <ModalFilterContainer />}
        {activeModal === 'clearTable' && <ModalClearTableContainer />}
        {activeModal === 'deleteSelected' && <ModalDeleteSelectedContainer />}
        {activeModal === 'saveEditedData' && <ModalSaveEditedDataContainer />}
        {activeModal === 'bufferSelectedData' && <ModalBufferSelectedContainer />}
    </Table>
);

export default TableView;
