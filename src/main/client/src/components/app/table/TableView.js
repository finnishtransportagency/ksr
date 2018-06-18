// @flow
import React from 'react';
import Table from '../../ui/blocks/Table';
import ReactTableContainer from './react-table/ReactTableContainer';

type Props = {
    toggleTable: Function,
    isOpen: boolean,
    activeNav: string,
};

const TableView = ({ toggleTable, isOpen, activeNav }: Props) => (
    <Table sideBar={activeNav} toggleTable={isOpen}>
        <Table.Link
            toggleTable={isOpen}
            onClick={() => { toggleTable(); }}
        >
            <i className={isOpen ? 'fas fa-angle-down' : 'fas fa-angle-up'} />
        </Table.Link>
        <ReactTableContainer />
    </Table>
);

export default TableView;
