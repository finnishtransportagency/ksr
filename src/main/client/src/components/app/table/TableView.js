// @flow
import React from 'react';
import Table from '../../ui/blocks/Table';
import ModalClearTableContainer from './modal-clear-table/ModalClearTableContainer';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';
import ModalFilterContainer from './modal-filter/ModalFilterContainer';
import strings from '../../../translations';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    activeNav: string,
    setActiveModal: (modal: string) => void,
    activeModal: string,
};

const TableView = ({
    toggleTable,
    isOpen,
    activeNav,
    setActiveModal,
    activeModal,
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
        </Table.ButtonWrapper>
        <TabbedTableContainer />
        {activeModal === 'filter' && <ModalFilterContainer />}
        {activeModal === 'clearTable' && <ModalClearTableContainer />}
    </Table>
);

export default TableView;
