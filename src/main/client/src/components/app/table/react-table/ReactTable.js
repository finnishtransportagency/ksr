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

    toggleSelection = (id, shiftKey, row) => {
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
