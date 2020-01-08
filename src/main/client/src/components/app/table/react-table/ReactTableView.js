// @flow
import React from 'react';
import 'react-table/react-table.css';
import { WrapperReactTable } from './styles';
import SelectableTable from '../selectable-table/SelectableTable';
import strings from '../../../../translations';
import {
    colorMain, colorMainDark, colorTableEdited, colorTableEditedDarker,
} from '../../../ui/defaultStyles';
import CustomTableView from './custom-table/CustomTableView';
import { toDisplayDate } from '../../../../utils/date';

type Props = {
    data: Array<any>,
    columns: Array<any>,
    setRowFilter: Function,
    toggleSelection: Function,
    toggleSelectAll: Function,
    selectAll: boolean,
    renderEditable: Function,
    renderFilter: Function,
};

const ReactTableView = ({
    data,
    columns,
    setRowFilter,
    toggleSelection,
    toggleSelectAll,
    selectAll,
    renderEditable,
    renderFilter,
}: Props) => (
    <WrapperReactTable
        columns={columns}
    >
        <SelectableTable
            className="-striped -highlight"
            onFetchData={(state, instance) => {
                const currentRecords = instance.getResolvedState().sortedData;
                const array = [];
                currentRecords.map(r => array.push({
                    id: r._original._id,
                    layerId: r._original._layerId,
                }));
                setRowFilter(array);
            }}
            data={data}
            TableComponent={CustomTableView}
            filterable
            columns={columns.map(c => ({
                ...c,
                Cell: renderEditable,
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
                Filter: ({ column, filter, onChange }) => renderFilter(column, filter, onChange),
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
                const editColor = r && r.index % 2 === 0
                    ? colorTableEditedDarker
                    : colorTableEdited;
                const selectedColor = r && r.index % 2 === 0 ? colorMainDark : colorMain;
                const color = r && r.row && r.row._original._selected && c.id !== '_selector'
                    ? selectedColor
                    : null;
                return {
                    style: {
                        background: r && r.original._edited && r.original._edited
                            .find(t => t.title === c.id) ? editColor : color,
                    },
                };
            }}
        />
    </WrapperReactTable>
);

export default ReactTableView;
