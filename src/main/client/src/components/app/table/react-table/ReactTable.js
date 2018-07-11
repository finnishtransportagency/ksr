// @flow
import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import ReactTableView from './ReactTableView';
import LoadingIcon from '../../shared/LoadingIcon';
import { WrapperReactTableNoTable } from './styles';
import strings from './../../../../translations';

type Props = {
    fetching: boolean,
    layer: {
        data: Array<Object>,
        columns: Array<Object>,
        id: string,
    },
    toggleSelection: Function,
    selectAll: boolean,
    toggleSelectAll: Function,
};

type State = {
    /* ... */
};

class ReactTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.renderEditable = this.renderEditable.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
    }

    componentDidUpdate() {
        const paginationBottom = document.getElementsByClassName('pagination-bottom')[0];
        if (paginationBottom) {
            // React Table heights need to be set programmatically for scrollbars to show correctly.
            const tableElement = document.getElementsByClassName('rt-rtable')[0];
            const tableHeight = paginationBottom.clientHeight;
            tableElement.style.height = `calc(100% - ${tableHeight}px)`;

            const bodyElement = document.getElementsByClassName('rt-tbody')[0];
            const headerElement = document.getElementsByClassName('rt-thead -header')[0];
            const filterElement = document.getElementsByClassName('rt-thead -filters')[0];
            const tbodyHeight = headerElement.clientHeight + filterElement.clientHeight;
            bodyElement.style.height = `calc(100% - ${tbodyHeight}px)`;
        }
    }

    renderEditable = (cellInfo: any) => (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
                this.props.layer.data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
            }}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(this.props.layer.data[cellInfo.index][cellInfo.column.id]),
            }}
        />
    );

    toggleSelection = (id: string, shiftKey: string, row: Object) => {
        this.props.toggleSelection(row);
    };

    render() {
        const { fetching, layer } = this.props;
        if (layer === null) {
            return (
                <WrapperReactTableNoTable>
                    {strings.table.noTableText}
                </WrapperReactTableNoTable>
            );
        } else if (!fetching) {
            const { columns, data } = layer;
            return (<ReactTableView
                data={data}
                toggleSelection={this.toggleSelection}
                columns={columns}
                selectAll={this.props.selectAll}
                toggleSelectAll={() => this.props.toggleSelectAll(layer.id)}
            />);
        }
        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
