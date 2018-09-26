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
    activeAdminTool: string,
    originalLayers: Array<Object>,
    editedLayers: Array<Object>,
    selectedData: boolean,
};

const TableView = ({
    toggleTable,
    isOpen,
    activeNav,
    setActiveModal,
    activeAdminTool,
    originalLayers,
    editedLayers,
    selectedData,
}: Props) => (
    <Table sideBar={activeNav === 'search' || activeNav === 'mapLayers' || activeNav === 'workspace'} tableOpen={isOpen}>
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
                title={strings.reactTable.saveEditedData}
                tableOpen={isOpen && activeAdminTool}
                disabled={originalLayers.every(o => o.source === 'shapefile') || !originalLayers.length || equals(originalLayers, editedLayers)}
                onClick={
                    originalLayers.length && !equals(originalLayers, editedLayers) ? () => {
                        setActiveModal('saveEditedData');
                    } : null}
            >
                <i className="fas fa-save" />
            </Table.Button>
            <Table.Button
                title={strings.reactTable.deleteSelected}
                tableOpen={isOpen && activeAdminTool}
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
    </Table>
);

export default TableView;
