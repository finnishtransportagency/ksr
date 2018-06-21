// @flow
import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import ReactTableView from './ReactTableView';
import LoadingIcon from '../../shared/LoadingIcon';

type Props = {
    fetching: boolean,
    data: Array<any>,
    columns: Array<any>,
};

type State = {
    /* ... */
};

class ReactTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.renderEditable = this.renderEditable.bind(this);
    }

    renderEditable = (cellInfo: any) => (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
                this.props.data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
            }}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(this.props.data[cellInfo.index][cellInfo.column.id]),
            }}
        />
    );

    render() {
        const { fetching, data, columns } = this.props;

        // eslint-disable-next-line no-param-reassign,no-return-assign
        columns.map(a => a.Cell = this.renderEditable);

        if (!fetching) {
            return <ReactTableView data={data} columns={columns} />;
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
