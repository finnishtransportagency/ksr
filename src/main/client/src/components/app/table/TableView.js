// @flow
import React from 'react';
import Table from '../../ui/blocks/Table';
import ModalClearTableContainer from './modal-clear-table/ModalClearTableContainer';
import ModalDeleteSelectedContainer from './modal-delete-selected/ModalDeleteSelectedContainer';
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
};

const TableView = ({
    toggleTable,
    isOpen,
    activeNav,
    setActiveModal,
    activeModal,
    adminToolActive,
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
                onClick={() => {
                    setActiveModal('filter');
                }}
            >
                <i className="fas fa-filter" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.clearTableData}
                tableOpen={isOpen}
                onClick={() => {
                    setActiveModal('clearTable');
                }}
            >
                <i className="fas fa-trash" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.deleteSelected}
                tableOpen={isOpen && adminToolActive}
                onClick={() => {
                    setActiveModal('deleteSelected');
                }}
            >
                <i className="fas fa-eraser" />
            </Table.Button>
        </Table.ButtonWrapper>
        <TabbedTableContainer />
        {activeModal === 'filter' && <ModalFilterContainer />}
        {activeModal === 'clearTable' && <ModalClearTableContainer />}
        {activeModal === 'deleteSelected' && <ModalDeleteSelectedContainer />}
    </Table>
);

export default TableView;
