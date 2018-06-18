// @flow
import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { WrapperReactTable } from './styles';
import strings from '../../../../translations';

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
            defaultPageSize={20}
            style={{
                height: '400px',
                textAlign: 'center',
            }}
            previousText={strings.reactTable.previousText}
            nextText={strings.reactTable.nextText}
            loadingText={strings.reactTable.loadingText}
            noDataText={strings.reactTable.noDataText}
            pageText={strings.reactTable.pageText}
            ofText={strings.reactTable.ofText}
            rowsText={strings.reactTable.rowsText}
        />
    </WrapperReactTable>
);

export default ReactTableView;
