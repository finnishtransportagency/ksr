// @flow
import React from 'react';
import 'react-table/react-table.css';
import { WrapperReactTable } from './styles';
import SelectableTable from '../selectable-table/SelectableTable';
import strings from '../../../../translations';
import { colorMainDark, colorMain, colorTableEdited, colorTableEditedDarker } from '../../../ui/defaultStyles';
import CustomTableView from './custom-table/CustomTableView';
import CustomTableBodyView from './custom-table-body/CustomTableBodyView';

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
    <WrapperReactTable>
        <SelectableTable
            className="-striped -highlight"
            data={data}
            TableComponent={CustomTableView}
            TbodyComponent={CustomTableBodyView}
            columns={columns.map(c => ({
                ...c,
                Cell: renderEditable,
            }))}
            filterable
            defaultFilterMethod={(filter, row) => {
                const id = filter.pivotId || filter.id;
                if (row[id] !== null && typeof row[id] === 'string') {
                    return (row[id] !== undefined
                        ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
                        : true);
                }

                return (row[id] !== undefined
                    ? String(row[id]).includes(filter.value)
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
                document.getElementsByClassName('tbody-scroll-wrapper')[0].scrollTop = 0;
            }}
            toggleSelection={toggleSelection}
            toggleAll={toggleSelectAll}
            getTdProps={(state, r, c) => {
                const color = r && r.index % 2 === 0 ? colorTableEditedDarker : colorTableEdited;
                return {
                    style: {
                        background: r && r.original._edited && r.original._edited
                            .find(t => t.title === c.id) ? color : null,
                    },
                };
            }}
            getTrProps={(state, r) => {
                const color = r && r.index % 2 === 0 ? colorMainDark : colorMain;
                return {
                    style: {
                        background: (
                            r &&
                            r.row &&
                            r.row._original._selected ? color : null
                        ),
                    },
                };
            }}
        />
    </WrapperReactTable>
);

export default ReactTableView;
