// @flow
import React, { Component } from 'react';
import 'react-table/react-table.css';
import { WrapperReactTable } from './styles';
import SelectableTable from '../selectable-table/SelectableTable';
import strings from '../../../../translations';
import { colorTableEdited, colorTableSelected } from '../../../ui/defaultStyles';
import CustomTableView from './custom-table/CustomTableView';
import { toDisplayDate } from '../../../../utils/date';
import { equals } from '../../../../utils/cellEditValidate';

type Props = {
    data: Array<any>,
    columns: Array<any>,
    setRowFilter: Function,
    toggleSelection: Function,
    toggleSelectAll: Function,
    selectAll: boolean,
    renderCustomCell: Function,
    renderFilter: Function,
    currentCellData: Object,
    activeAdminTool: string,
    activeTable: string,
    layerList: Object[],
};

type State = {
    filtered: Object[],
};

class ReactTableView extends Component<Props, State> {
    // Custom view update handling to reduce redundant re-renders for improved performance
    shouldComponentUpdate(nextProps: Props) {
        const {
            data, currentCellData, activeAdminTool, activeTable, columns, layerList,
        } = this.props;

        const dataChanged = JSON.stringify(data) !== JSON.stringify(nextProps.data);
        const currentCellChanged = currentCellData.title !== null
            && nextProps.currentCellData.title !== null;
        const adminChanged = nextProps.activeAdminTool !== activeAdminTool;
        const tableChanged = nextProps.activeTable !== activeTable;
        const layerListChanged = JSON.stringify(nextProps.layerList) !== JSON.stringify(layerList);
        const filteredColumnsChanged = nextProps.columns.length
            !== columns.length;

        return tableChanged
            || adminChanged
            || dataChanged
            || currentCellChanged
            || filteredColumnsChanged
            || layerListChanged;
    }

    render() {
        const {
            data,
            columns,
            setRowFilter,
            toggleSelection,
            toggleSelectAll,
            selectAll,
            renderCustomCell,
            renderFilter,
            currentCellData,
        } = this.props;

        return (
            <WrapperReactTable
                columns={columns}
            >
                <SelectableTable
                    className="-striped -highlight"
                    onFetchData={(state, instance) => {
                        const currentRecords = instance.getResolvedState().sortedData;
                        setRowFilter(currentRecords.map(r => ({
                            id: r._original._id,
                            layerId: r._original._layerId,
                        })));
                    }}
                    data={data}
                    TableComponent={CustomTableView}
                    filterable
                    columns={columns.map(c => ({
                        ...c,
                        Header: <span title={c.Header}>{c.Header}</span>,
                        Cell: renderCustomCell,
                        filterMethod: (filter, row) => {
                            const id = filter.pivotId || filter.id;
                            if (row._original[id] !== null && typeof row._original[id] === 'string') {
                                if (row._original[id] !== undefined) {
                                    return !!String(row._original[id].toLowerCase())
                                        .includes(filter.value.toLowerCase());
                                }
                                return true;
                            }

                            if (row._original[id] !== null && c.className === 'date'
                                && toDisplayDate(row._original[id]) !== null) {
                                return toDisplayDate(row._original[id]).includes(filter.value);
                            }
                            if (row._original[id] !== undefined) {
                                return !!String(row._original[id]).includes(filter.value);
                            }
                            return true;
                        },
                        Filter: ({
                            column,
                            filter,
                            onChange,
                        }) => renderFilter(column, filter, onChange),
                    }))}
                    style={{
                        height: '100%',
                        textAlign: 'center',
                    }}
                    previousText={strings.reactTable.previousText}
                    nextText={strings.reactTable.nextText}
                    loadingText={strings.reactTable.loadingText}
                    noDataText={strings.reactTable.noDataText}
                    pageText={strings.reactTable.pageText}
                    ofText={strings.reactTable.ofText}
                    rowsText={strings.reactTable.rowsText}
                    selectType="checkbox"
                    isSelected={r => r._selected}
                    selectAll={selectAll}
                    onPageChange={() => {
                        document.getElementsByClassName('rtable-scroll-wrapper')[0].scrollTop = 0;
                    }}
                    toggleSelection={toggleSelection}
                    toggleAll={toggleSelectAll}
                    getTdProps={(state, r, c) => {
                        const color = r && r.row && r.row._original._selected && c.id !== '_selector'
                            ? colorTableSelected
                            : null;
                        const cellRowInputChange = c.id === currentCellData.title && r
                        && r.index === currentCellData.rowIndex
                            ? !equals(currentCellData.originalData, currentCellData.editedData)
                            : r && r.original._edited && r.original._edited
                                .some(t => t.title === c.id);
                        return {
                            style: {
                                background: cellRowInputChange
                                    ? colorTableEdited
                                    : color,
                            },
                        };
                    }}
                />
            </WrapperReactTable>
        );
    }
}

export default ReactTableView;
