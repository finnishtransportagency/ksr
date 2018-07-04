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
                this.props.layer.data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
            }}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(this.props.layer.data[cellInfo.index][cellInfo.column.id]),
            }}
        />
    );

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
            return <ReactTableView data={data} columns={columns} />;
        }
        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
