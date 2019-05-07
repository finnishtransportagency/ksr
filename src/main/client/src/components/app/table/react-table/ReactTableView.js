// @flow
import React from 'react';
import 'react-table/react-table.css';
import { WrapperReactTable } from './styles';
import SelectableTable from '../selectable-table/SelectableTable';
import strings from '../../../../translations';
import {
    colorMainDark,
    colorMain,
    colorTableEdited,
    colorTableEditedDarker,
} from '../../../ui/defaultStyles';
import CustomTableView from './custom-table/CustomTableView';

type Props = {
    data: Array<any>,
    columns: Array<any>,
    toggleSelection: Function,
    toggleSelectAll: Function,
    selectAll: boolean,
    renderEditable: Function,
};

const ReactTableView = ({
    data,
    columns,
    toggleSelection,
    toggleSelectAll,
    selectAll,
    renderEditable,
}: Props) => (
    <WrapperReactTable columns={columns}>
        <SelectableTable
            className="-striped -highlight"
            data={data}
            TableComponent={CustomTableView}
            columns={columns.map(c => ({
                ...c,
                Cell: renderEditable,
            }))}
            filterable
            defaultFilterMethod={(filter, row) => {
                const id = filter.pivotId || filter.id;
                if (row._original[id] !== null && typeof row._original[id] === 'string') {
                    return (row._original[id] !== undefined
                        ? String(row._original[id].toLowerCase())
                            .includes(filter.value.toLowerCase())
                        : true);
                }

                return (row._original[id] !== undefined
                    ? String(row._original[id]).includes(filter.value)
                    : true);
            }}
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
