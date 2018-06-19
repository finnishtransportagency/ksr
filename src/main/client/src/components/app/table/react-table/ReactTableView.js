// @flow
import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { WrapperReactTable } from './styles';
import strings from '../../../../translations';
import { colorTableHiglightSelected as colorHighlight } from '../../../ui/defaultStyles';

type Props = {
    data: Array<any>,
    columns: Array<any>,
};

const ReactTableView = ({ data, columns }: Props) => (
    <WrapperReactTable>
        <ReactTable
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
            getTrProps={(state, r) => (
                {
                    style: {
                        /* eslint-disable-next-line no-underscore-dangle */
                        background: r && r.row && r.row._original._selected ? colorHighlight : null,
                    },
                }
            )}
        />
    </WrapperReactTable>
);

export default ReactTableView;
