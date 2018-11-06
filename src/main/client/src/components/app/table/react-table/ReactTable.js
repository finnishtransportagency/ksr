// @flow
import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import { cellEditValidate, preventKeyPress } from '../../../../utils/cellEditValidate';
import { addContractColumn } from '../../../../utils/contracts/contractColumn';
import LoadingIcon from '../../shared/LoadingIcon';
import ReactTableView from './ReactTableView';
import { WrapperReactTableNoTable } from './styles';
import strings from './../../../../translations';

type Props = {
    fetching: boolean,
    layer: {
        id: string,
        data: Array<Object>,
        columns: Array<Object>,
    },
    toggleSelection: Function,
    selectAll: boolean,
    toggleSelectAll: Function,
    setEditedLayer: Function,
    layerList: Array<Object>,
    activeTable: string,
    activeAdminTool: string,
    setActiveModal: (activeModal: string) => void,
    setContractListInfo: (
        layerId: string,
        objectId: number,
        contractIdField: string,
        contractDescriptionField: string,
    ) => void,
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

    handleContractClick = (objectId: number) => {
        const {
            setActiveModal, setContractListInfo, activeTable, layerList,
        } = this.props;
        const layerId = activeTable.replace('.s', '');
        const currentLayer: any = layerList.find(ll => ll.id === layerId);
        setActiveModal('featureContracts');
        setContractListInfo(
            layerId,
            objectId,
            currentLayer.contractIdField,
            currentLayer.contractDescriptionField,
        );
    };

    renderEditable = (cellInfo: Object) => {
        const {
            layer, setEditedLayer, layerList, activeTable, activeAdminTool,
        } = this.props;

        const currentLayer = layerList.find(l => l.id === activeTable);

        if (currentLayer) {
            const cellField = currentLayer.fields.find(f => f.name === cellInfo.column.Header);

            const contentEditable = activeAdminTool === currentLayer.id
                && currentLayer._source !== 'shapefile'
                && cellField.editable;

            const content = cellField && cellField.type === 'esriFieldTypeDate' ?
                (new Date(layer.data[cellInfo.index][cellInfo.column.id])).toISOString() :
                layer.data[cellInfo.index][cellInfo.column.id];

            let className = '';
            if (!contentEditable) {
                className = 'content-not-editable';
            } else if (
                (content === null || (typeof content === 'string' && content.trim().length === 0))
                && !cellField.nullable) {
                className = 'content-not-valid';
            }

            return (
                <div
                    style={{ minHeight: '1rem' }}
                    role="textbox"
                    tabIndex={0}
                    className={className}
                    contentEditable={contentEditable}
                    suppressContentEditableWarning
                    onKeyPress={(e) => {
                        if (contentEditable) preventKeyPress(e, cellField);
                    }}
                    onBlur={(e) => {
                        if (contentEditable) {
                            const data = cellEditValidate(e, layer.data, cellField, cellInfo);
                            setEditedLayer(data);
                        }
                    }}
                    dangerouslySetInnerHTML={{ // eslint-disable-line
                        __html: DOMPurify.sanitize(content !== null ? String(content) : null),
                    }}
                />
            );
        }

        return null;
    };

    render() {
        const {
            fetching, layer, selectAll, toggleSelectAll, layerList,
        } = this.props;

        if (!layer) {
            return (
                <WrapperReactTableNoTable>
                    {strings.table.noTableText}
                </WrapperReactTableNoTable>
            );
        } else if (!fetching && layerList) {
            const { columns, data } = layer;

            const currentLayer: any = layerList.find(ll => ll.id === layer.id);
            const contractColumns = currentLayer && currentLayer.hasRelations
                ? addContractColumn(this.handleContractClick, columns)
                : null;

            return (<ReactTableView
                data={data}
                toggleSelection={this.toggleSelection}
                columns={contractColumns || columns}
                selectAll={selectAll}
                toggleSelectAll={() => toggleSelectAll(layer.id)}
                renderEditable={this.renderEditable}
            />);
        }
        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
