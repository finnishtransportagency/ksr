// @flow
import React from 'react';
import 'react-table/react-table.css';
import { WrapperReactTable } from './styles';
import SelectableTable from '../selectable-table/SelectableTable';
import strings from '../../../../translations';
import { colorMainHighlight } from '../../../ui/defaultStyles';

type Props = {
    data: Array<any>,
    columns: Array<any>,
    toggleSelection: Function,
    toggleSelectAll: Function,
    selectAll: boolean,
};

const ReactTableView = ({
    data,
    columns,
    toggleSelection,
    toggleSelectAll,
    selectAll,
}: Props) => (
    <WrapperReactTable>
        <SelectableTable
            className="-striped -highlight"
            data={data}
            columns={columns}
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
            toggleSelection={toggleSelection}
            toggleAll={toggleSelectAll}
            getTrProps={(state, r) => (
                {
                    style: {
                        background: (
                            r &&
                            r.row &&
                            r.row._original._selected ? colorMainHighlight : null),
                    },
                }
            )}
        />
    </WrapperReactTable>
);

export default ReactTableView;
