// @flow
import React from 'react';
import Table from '../../ui/blocks/Table';
import TabbedTableContainer from './tabbed-table/TabbedTableContainer';
import TableButtonsContainer from './table-buttons/TableButtonsContainer';

type Props = {
    isOpen: boolean,
    activeNav: string,
    portalIsOpen: boolean,
};

function TableView({ isOpen, activeNav, portalIsOpen }: Props): React$Element<React$FragmentType> {
    return (
        <Table
            sideBar={activeNav === 'search' || activeNav === 'mapLayers' || activeNav === 'workspace' || activeNav === 'offline'}
            tableOpen={isOpen}
            portalOpen={portalIsOpen}
            id="TableView"
        >
            <TableButtonsContainer />
            <TabbedTableContainer />
        </Table>
    );
}

export default TableView;
