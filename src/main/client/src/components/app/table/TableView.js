// @flow
import React from 'react';
import Table from '../../ui/blocks/Table';
import equals from 'nano-equal';
import ModalClearTableContainer from './modal-clear-table/ModalClearTableContainer';
import ModalSaveEditedDataContainer from './modal-save-edited-data/ModalSaveEditedDataContainer';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';
import ModalFilterContainer from './modal-filter/ModalFilterContainer';
import strings from '../../../translations';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    activeNav: string,
    setActiveModal: (modal: string) => void,
    activeModal: string,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
};

const TableView = ({
    toggleTable,
    isOpen,
    activeNav,
    setActiveModal,
    activeModal,
    originalLayers,
    editedLayers,
}: Props) => (
    <Table sideBar={activeNav} tableOpen={isOpen}>
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
        </Table.ButtonWrapper>
        <TabbedTableContainer />
        {activeModal === 'filter' && <ModalFilterContainer />}
        {activeModal === 'clearTable' && <ModalClearTableContainer />}
        {activeModal === 'saveEditedData' && <ModalSaveEditedDataContainer />}
    </Table>
);

export default TableView;
