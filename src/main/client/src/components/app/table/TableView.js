// @flow
import React from 'react';
import Table from '../../ui/blocks/Table';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';
import ModalContainer from './modal/ModalContainer';

type Props = {
    toggleFilter: Function,
    isOpenFilter: boolean,
    toggleTable: Function,
    isOpen: boolean,
    activeNav: string,
};

const TableView = ({
    toggleFilter, isOpenFilter, toggleTable, isOpen, activeNav,
}: Props) => (
    <Table sideBar={activeNav} toggleTable={isOpen}>
        <Table.Link
            toggleTable={isOpen}
            onClick={() => {
                toggleTable();
            }}
        >
            <i className={isOpen ? 'fas fa-angle-down' : 'fas fa-angle-up'} />
        </Table.Link>
        <Table.Filter
            toggleFilter={isOpen}
            onClick={() => {
                toggleFilter();
            }}
        >
            <i className="fas fa-filter" />
        </Table.Filter>
        <TabbedTableContainer />
        <ModalContainer modalOpen={isOpenFilter} />
    </Table>
);

export default TableView;
