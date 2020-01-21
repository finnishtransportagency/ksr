// @flow
import React from 'react';
import Table from '../../ui/blocks/Table';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';
import TableButtonsContainer from './table-buttons/TableButtonsContainer';

type Props = {
    isOpen: boolean,
    activeNav: string,
};

const TableView = ({ isOpen, activeNav }: Props) => (
    <Table
        sideBar={activeNav === 'search' || activeNav === 'mapLayers' || activeNav === 'workspace' || activeNav === 'offline'}
        tableOpen={isOpen}
    >
        <TableButtonsContainer />
        <TabbedTableContainer />
    </Table>
);

export default TableView;
