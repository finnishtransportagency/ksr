// @flow
import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import { cellEditValidate, preventKeyPress } from '../../../../utils/cellEditValidate';
import { addContractColumn } from '../../../../utils/contracts/contractColumn';
import LoadingIcon from '../../shared/LoadingIcon';
import ReactTableView from './ReactTableView';
import { WrapperReactTableNoTable, TableSelect } from './styles';
import strings from '../../../../translations';

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
    setActiveModal: (activeModal: string, modalData: any) => void,
    setContractListInfo: (layerId: string, objectId: number) => void,
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

    getCellContent = (layer: Object, cellField: Object, cellInfo: Object) => {
        if (cellField && cellField.type === 'esriFieldTypeDate') {
            return (new Date(layer.data[cellInfo.index][cellInfo.column.id])).toISOString();
        }

        if (cellField && cellField.type === 'esriFieldTypeDouble') {
            return layer.data[cellInfo.index][cellInfo.column.id]
                ? layer.data[cellInfo.index][cellInfo.column.id].toFixed(3)
                : '0.000';
        }
        return layer.data[cellInfo.index][cellInfo.column.id];
    };

    getCellClassName = (contentEditable: boolean, cellField: Object, content: string) => {
        let className = '';
        if (!contentEditable) {
            className = 'content-not-editable';
        } else if (
            (content === null || (typeof content === 'string' && content.trim().length === 0))
            && !cellField.nullable) {
            className = 'content-not-valid';
        }
        return className;
    };

    getDisplayContent = (cellField: Object, content: any) => {
        const { domain } = cellField;
        if (content === null) {
            return null;
        }

        if (domain && (domain.type === 'codedValue' || domain.type === 'coded-value')) {
            const codedValue = domain.codedValues.find(cv => cv.code === content);
            if (codedValue) {
                return codedValue.name;
            }
            return null;
        }
        return String(content);
    };

    handleContractClick = (objectId: number) => {
        const {
            setActiveModal, setContractListInfo, activeTable, layerList,
        } = this.props;
        const layerId = activeTable.replace('.s', '');
        const layer = layerList.find(l => l.id === layerId);

        if (layer && layer.type === 'agfl') {
            const modalData = {
                contractObjectId: objectId,
                layerId,
                source: 'table',
            };

            setActiveModal('contractDetails', modalData);
        } else {
            setActiveModal('featureContracts');
            setContractListInfo(layerId, objectId);
        }
    };

    isCellEditable = (currentLayer: Object, cellField: Object) => {
        const { activeAdminTool } = this.props;
        return activeAdminTool === currentLayer.id
            && currentLayer._source !== 'shapefile'
            && currentLayer.layerPermission.updateLayer
            && cellField.editable;
    };

    toggleSelection = (id: string, shiftKey: string, row: Object) => {
        const { toggleSelection } = this.props;
        toggleSelection(row);
    };

    renderSelect = (cellField: Object, content: any, layer: Object, cellInfo: Object) => {
        const { setEditedLayer } = this.props;
        const options = cellField.domain.codedValues.map(v => (
            <option key={v.code} value={v.code}>{v.name}</option>
        )).concat([
            // Add empty option for empty and null values
            <option key="-" value="">--</option>,
        ]);
        return (
            <TableSelect
                value={content === null ? '' : content}
                onChange={(e) => {
                    setEditedLayer(cellEditValidate(
                        e.target.value,
                        layer.data,
                        cellField,
                        cellInfo,
                    ));
                }}
            >
                {options}
            </TableSelect>
        );
    };

    renderDiv = (
        cellField: Object,
        content: any,
        layer: Object,
        cellInfo: Object,
        contentEditable: boolean,
    ) => {
        const className = this.getCellClassName(contentEditable, cellField, content);
        const { setEditedLayer } = this.props;
        const textContent = this.getDisplayContent(cellField, content);
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
                        setEditedLayer(cellEditValidate(
                            e.target.innerText,
                            layer.data,
                            cellField,
                            cellInfo,
                        ));
                    }
                }}
                dangerouslySetInnerHTML={{ // eslint-disable-line
                    __html: DOMPurify.sanitize(textContent),
                }}
            />
        );
    };

    renderEditable = (cellInfo: Object) => {
        const { layer, layerList, activeTable } = this.props;
        const currentLayer = layerList.find(l => l.id === activeTable);

        if (currentLayer && currentLayer.fields) {
            const cellField = currentLayer.fields.find(f => `${activeTable}/${f.name}` === cellInfo.column.id);
            if (cellField) {
                const contentEditable = this.isCellEditable(currentLayer, cellField);
                const content = this.getCellContent(layer, cellField, cellInfo);
                if (
                    cellField.domain
                    && (cellField.domain.type === 'codedValue' || cellField.domain.type === 'coded-value')
                    && contentEditable
                ) {
                    return this.renderSelect(cellField, content, layer, cellInfo);
                }
                return this.renderDiv(cellField, content, layer, cellInfo, contentEditable);
            }
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
        }

        if (!fetching && layerList) {
            const { columns, data } = layer;

            const currentLayer: any = layerList.find(ll => ll.id === layer.id);
            const contractColumns = (currentLayer
            && currentLayer.hasRelations
            && currentLayer.type !== 'agfl')
            || (currentLayer
                && currentLayer.type === 'agfl'
                && !currentLayer.relationColumnIn
                && !currentLayer.relationColumnOutnull)
                ? addContractColumn(this.handleContractClick, columns, currentLayer.type)
                : null;

            return (
                <ReactTableView
                    data={data}
                    toggleSelection={this.toggleSelection}
                    columns={contractColumns || columns}
                    selectAll={selectAll}
                    toggleSelectAll={() => toggleSelectAll(layer.id)}
                    renderEditable={this.renderEditable}
                />
            );
        }
        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
