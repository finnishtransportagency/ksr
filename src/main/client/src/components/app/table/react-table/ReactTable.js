// @flow
import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import { cellEditValidate, preventKeyPress } from '../../../../utils/cellEditValidate';
import ReactTableView from './ReactTableView';
import LoadingIcon from '../../shared/LoadingIcon';
import { WrapperReactTableNoTable } from './styles';
import strings from './../../../../translations';

type Props = {
    fetching: boolean,
    layer: {
        id: string,
        data: Array<Object>,
        columns: Array<Object>,
        id: string,
    },
    toggleSelection: Function,
    selectAll: boolean,
    toggleSelectAll: Function,
    setEditedLayer: Function,
    layerList: Array<Object>,
    activeTable: string,
    activeAdminTool: string,
};

class ReactTable extends Component<Props> {
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

    toggleSelection = (id: string, shiftKey: string, row: Object) => {
        this.props.toggleSelection(row);
    };

    renderEditable = (cellInfo: Object) => {
        const {
            layer, setEditedLayer, layerList, activeTable, activeAdminTool,
        } = this.props;

        const currentLayer = layerList.find(l => l.id === activeTable);

        if (currentLayer) {
            const cellField = currentLayer.fields.find(f => f.name === cellInfo.column.Header);
            return (
                <div
                    style={{ minHeight: '1rem' }}
                    role="textbox"
                    tabIndex={0}
                    contentEditable={activeAdminTool.length && cellField.type !== 'esriFieldTypeOID' && currentLayer.source !== 'shapefile'}
                    suppressContentEditableWarning
                    onKeyPress={(e) => {
                        preventKeyPress(e, cellField);
                    }}
                    onBlur={(e) => {
                        const data = cellEditValidate(e, layer.data, cellField, cellInfo);
                        setEditedLayer(data);
                    }}
                    dangerouslySetInnerHTML={{ // eslint-disable-line
                        __html: DOMPurify.sanitize(layer.data[cellInfo.index][cellInfo.column.id]),
                    }}
                />
            );
        }

        return null;
    };

    render() {
        const {
            fetching, layer, selectAll, toggleSelectAll,
        } = this.props;

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
                selectAll={selectAll}
                toggleSelectAll={() => toggleSelectAll(layer.id)}
                renderEditable={this.renderEditable}
            />);
        }
        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
