// @flow
import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import { cellEditValidate, getValue, preventKeyPress } from '../../../../utils/cellEditValidate';
import { addContractColumn } from '../../../../utils/contracts/contractColumn';
import LoadingIcon from '../../shared/LoadingIcon';
import ReactTableView from './ReactTableView';
import { TableInput, TableSelect, WrapperReactTableNoTable } from './styles';
import strings from '../../../../translations';
import { toDisplayDate, toISODate } from '../../../../utils/date';
import { getCodedValue } from '../../../../utils/parseFeatureData';
import { TextInput } from '../../../ui/elements';
import { nestedVal } from '../../../../utils/nestedValue';
import { isContract } from '../../../../utils/layers';
import { childLayerDomainValues } from '../../../../utils/fields';

type Props = {
    fetching: boolean,
    layerFeatures: {
        id: string,
        data: Array<Object>,
        columns: Array<Object>,
    },
    setRowFilter: Function,
    toggleSelection: Function,
    selectAll: boolean,
    toggleSelectAll: Function,
    setEditedLayer: Function,
    layerList: Array<Object>,
    activeTable: string,
    activeAdminTool: string,
    setActiveModal: (activeModal: string, modalData: any) => void,
    setContractListInfo: (layerId: string, objectId: number) => void,
    setTableEdited: Function,
    updatePortal: Function,
    portalIsOpen: boolean,
    activePage: Object,
    setActivePage: Function,
};

type State = {
    currentCellData: {
        title: ?string,
        originalData: ?string | ?number,
        editedData: ?string | ?number,
        rowIndex: ?number,
        key: ?string,
    },
    tableInstance: Object,
};

const defaultState = {
    currentCellData: {
        title: null,
        originalData: null,
        editedData: null,
        rowIndex: null,
        key: null,
    },
    tableInstance: undefined,
};

let cellEditTimer;
class ReactTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = defaultState;

        this.renderFilter = this.renderFilter.bind(this);
        this.renderCustomCell = this.renderCustomCell.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
    }

    componentDidUpdate(prevProps: Props) {
        const { updatePortal, portalIsOpen } = this.props;
        const paginationBottom = document.getElementsByClassName('pagination-bottom')[0];
        if (paginationBottom) {
            // Send update request to table window portal
            // to re-render also when main screen table changes
            if (portalIsOpen) updatePortal();
            // React Table heights need to be set programmatically for scrollbars to show correctly.
            const tableElement = document.getElementsByClassName('rt-rtable')[0];
            const tableHeight = paginationBottom.clientHeight;
            tableElement.style.height = `calc(100% - ${tableHeight}px)`;

            const bodyElement = document.getElementsByClassName('rt-tbody')[0];
            const headerElement = document.getElementsByClassName('rt-thead -header')[0];
            const filterElement = document.getElementsByClassName('rt-thead -filters')[0];
            // Add two extra pixels to prevent unintended scroll from appearing.
            const tbodyHeight = headerElement.clientHeight + filterElement.clientHeight + 2;
            bodyElement.style.height = `calc(100% - ${tbodyHeight}px)`;
        }

        const { currentCellData, tableInstance } = this.state;
        const { setTableEdited, layerFeatures, activeTable } = this.props;

        // Logic for handling whether table save button should be disabled or not
        if (layerFeatures) {
            const { data } = layerFeatures;

            const editedRows = data.filter(d => d._edited.length > 0);

            if (editedRows.length > 0) {
                if (editedRows.length === 1
                    && editedRows[0]._edited.length === 1
                    && editedRows[0]._key === currentCellData.key
                    && editedRows[0]._edited[0].title === currentCellData.title) {
                    if (currentCellData.originalData !== currentCellData.editedData) {
                        setTableEdited(true);
                    } else {
                        setTableEdited(false);
                    }
                } else {
                    setTableEdited(true);
                }
            } else if (currentCellData.title !== null) {
                if (currentCellData.originalData !== currentCellData.editedData) {
                    setTableEdited(true);
                } else {
                    setTableEdited(false);
                }
            } else {
                setTableEdited(false);
            }
        }

        if (prevProps.activeTable !== activeTable && tableInstance) {
            this.onFetchData();
        }
    }

    getCellContent = (cellField: Object, cellInfo: Object) => {
        const { layerFeatures } = this.props;
        const { data } = layerFeatures;

        if (cellField && cellField.type === 'esriFieldTypeDouble') {
            return data[cellInfo.index][cellInfo.column.id]
                ? data[cellInfo.index][cellInfo.column.id].toFixed(2)
                : '0.00';
        }
        return data[cellInfo.index][cellInfo.column.id];
    };

    getCellClassName = (contentEditable: boolean, cellField: Object, content: string) => {
        const { activeAdminTool, activeTable, layerList } = this.props;

        const activeLayer: Object = layerList.find(l => l.id === activeTable.replace('.s', ''));
        const parentLayer = activeLayer.parentLayer
            && layerList.find(l => l.id === activeLayer.parentLayer);
        let className = '';

        if ((activeLayer && activeAdminTool === activeLayer.id)
            || (parentLayer && activeAdminTool === parentLayer.id)) {
            if (contentEditable) {
                className = 'content-editable';
            } else {
                className = 'content-not-editable';
            }
        }

        if ((content === null || (typeof content === 'string' && content.trim().length === 0))
            && !cellField.nullable) {
            className += ' content-not-valid';
        }

        return className;
    };

    getDisplayContent = (cellField: Object, content: any) => {
        const { domain } = cellField;
        if (content === null) {
            return '';
        }

        return getCodedValue(domain, content);
    };

    handleContractClick = (row: Object) => {
        const {
            setActiveModal, setContractListInfo, activeTable, layerList,
        } = this.props;

        const layerId = activeTable.replace('.s', '');
        const parentLayerId = nestedVal(layerList.find(l => l.id === layerId), ['parentLayer']);
        const layer: Object = parentLayerId
            ? layerList.find(l => l.id === parentLayerId.replace('.s', ''))
            : layerList.find(l => l.id === layerId);

        const idFieldName = nestedVal(
            layer.fields.find(field => field.type === 'esriFieldTypeOID'),
            ['name'],
        );

        const idField = `${activeTable}/${idFieldName}`;
        const objectId = row.original[idField];

        if (isContract(layer)) {
            const modalData = {
                contractObjectId: objectId,
                layerId: layer.id,
                source: 'table',
            };

            setActiveModal('contractDetails', modalData);
        } else {
            setActiveModal('featureContracts');
            setContractListInfo(layer.id, objectId);
        }
    };

    isCellEditable = (cellField: Object) => {
        const { activeAdminTool, layerList, activeTable } = this.props;

        const activeLayer = layerList.find(l => l.id === activeTable.replace('.s', ''));
        const parentLayer = activeLayer && activeLayer.parentLayer
            && layerList.find(l => l.id === activeLayer.parentLayer);

        if (activeLayer && parentLayer) {
            return (activeAdminTool === activeLayer.id || activeAdminTool === parentLayer.id)
                && activeLayer._source !== 'shapefile'
                && parentLayer.layerPermission.updateLayer
                && cellField.editable
                && activeLayer.updaterField !== cellField.name
                && parentLayer.updaterField !== cellField.name
                && !parentLayer.requiredUniqueFields.some(field => field === cellField.name);
        }

        if (activeLayer) {
            return activeAdminTool === activeLayer.id
                && activeLayer._source !== 'shapefile'
                && activeLayer.layerPermission.updateLayer
                && cellField.editable
                && cellField.name !== 'PROPERTY_ID'
                && activeLayer.updaterField !== cellField.name
                && !activeLayer.requiredUniqueFields.some(field => field === cellField.name);
        }

        return false;
    };

    toggleSelection = (id: string, shiftKey: string, row: Object) => {
        const { toggleSelection } = this.props;
        toggleSelection(row);
    };

    renderSelect = (cellField: Object, content: any, cellInfo: Object) => {
        const { setEditedLayer, layerFeatures, setTableEdited } = this.props;
        const { data } = layerFeatures;
        // Add empty option for empty and null values
        const options = [<option key="-" value="" />].concat(
            cellField.domain.codedValues.map(v => (
                <option key={v.code} value={v.code}>{v.name}</option>
            )),
        );
        return (
            <TableSelect
                value={content === null ? '' : content}
                onChange={(evt) => {
                    const val = cellEditValidate(
                        evt.target.value,
                        data,
                        cellField,
                        cellInfo,
                    );
                    if (val) {
                        setEditedLayer(val);
                        setTableEdited(val._edited.length > 0);
                    }
                }}
            >
                {options}
            </TableSelect>
        );
    };

    handlePageChange = (pageIndex) => {
        const { activeTable, setActivePage } = this.props;
        setActivePage({ layerId: activeTable, page: pageIndex });
        document.getElementsByClassName('rtable-scroll-wrapper')[0].scrollTop = 0;
    };

    renderSelectInput = (cellField: Object, cellInfo: Object, filter: any, onChange: Function) => {
        // Add empty option for empty and null values
        const options = [<option key="-" value="" />].concat(
            cellField.domain.codedValues.map(v => (
                <option key={v.code} value={v.code}>{v.name}</option>
            )),
        );
        return (
            <TableSelect
                value={filter ? filter.value : ''}
                onChange={(event) => {
                    this.handlePageChange(0);
                    onChange(event.target.value);
                }}
            >
                {options}
            </TableSelect>
        );
    };

    renderDateInput = (cellField: Object, content: any, cellInfo: Object) => {
        const { setEditedLayer, layerFeatures, setTableEdited } = this.props;
        const { data } = layerFeatures;

        return (
            <TableInput
                type="date"
                value={toISODate(content)}
                title={toDisplayDate(content)}
                onChange={(evt) => {
                    const val = cellEditValidate(
                        evt.target.value,
                        data,
                        cellField,
                        cellInfo,
                    );
                    if (val) {
                        setEditedLayer(val);
                        setTableEdited(val._edited.length > 0);
                    }
                }}
            />
        );
    };

    renderDiv = (
        cellField: Object,
        content: any,
    ) => {
        const textContent = this.getDisplayContent(cellField, content);
        return (
            <div
                title={textContent}
                style={{ minHeight: '1rem' }}
                /* eslint-disable-next-line react/no-danger */
                dangerouslySetInnerHTML={{
                    __html: DOMPurify().sanitize(textContent),
                }}
            />
        );
    };

    renderEditableDiv = (
        cellField: Object,
        content: any,
        cellInfo: Object,
        contentEditable: boolean,
    ) => {
        const { setEditedLayer, layerFeatures } = this.props;
        const { data } = layerFeatures;

        const className = this.getCellClassName(contentEditable, cellField, content);
        const textContent = this.getDisplayContent(cellField, content);
        return (
            <div
                title={textContent}
                style={{ minHeight: '1rem' }}
                role="textbox"
                tabIndex={0}
                className={className}
                contentEditable={contentEditable}
                suppressContentEditableWarning
                onKeyPress={(evt) => {
                    if (contentEditable) {
                        preventKeyPress(evt, cellField);
                    }
                }}
                onInput={(evt) => {
                    const updateCellWithDelay = (text, key) => {
                        cellEditTimer = setTimeout(() => {
                            const { currentCellData } = this.state;
                            if (currentCellData.key === key) {
                                this.setState(prevState => ({
                                    currentCellData: {
                                        ...prevState.currentCellData,
                                        editedData: getValue(cellField.type, text),
                                    },
                                }));
                            }
                        }, 500);
                    };

                    const { currentCellData } = this.state;
                    if (contentEditable) {
                        clearTimeout(cellEditTimer);
                        updateCellWithDelay(evt.target.innerText, currentCellData.key);
                    }
                }}
                onFocus={(evt) => {
                    if (contentEditable) {
                        const text = evt.target.innerText;
                        const originalData = data[cellInfo.index]._edited.length > 0
                        && data[cellInfo.index]._edited.some(e => e.title
                            === cellInfo.column.id)
                            ? data[cellInfo.index]._edited.find(e => e.title
                                === cellInfo.column.id).originalData
                            : getValue(cellField.type, text);

                        this.setState({
                            currentCellData: {
                                title: cellInfo.column.id,
                                originalData,
                                editedData: getValue(cellField.type, text),
                                rowIndex: cellInfo.index,
                                key: cellInfo.original._key,
                            },
                        });
                    }
                }}
                onBlur={(evt) => {
                    if (contentEditable) {
                        const text = evt.target.innerText;
                        const val = cellEditValidate(
                            text,
                            data,
                            cellField,
                            cellInfo,
                        );

                        if (val) setEditedLayer(val);

                        this.setState({
                            currentCellData: defaultState.currentCellData,
                        });
                    }
                }}
                /* eslint-disable-next-line react/no-danger */
                dangerouslySetInnerHTML={{
                    __html: DOMPurify().sanitize(textContent),
                }}
            />
        );
    };

    renderInput = (cellField: Object, filter: any, onChange: Function) => (
        <TextInput
            style={{ minHeight: '1rem' }}
            type="text"
            value={filter ? filter.value : ''}
            onChange={(evt) => {
                this.handlePageChange(0);
                onChange(evt.target.value);
            }}
        />
    );

    renderCustomCell = (cellInfo: Object) => {
        const { layerList, activeTable, activeAdminTool } = this.props;
        const activeLayer = layerList.find(l => l.id === activeTable.replace('.s', ''));
        const originalLayer = layerList.find(l => l.id === activeTable.replace('.s', ''));

        let cellField = activeLayer && activeLayer.fields
            .find(f => `${activeTable}/${f.name}` === cellInfo.column.id);

        if (cellField && activeLayer && activeLayer.fields) {
            const parentLayer = layerList.find(l => l.id === activeLayer.parentLayer);
            const originalCell = originalLayer && originalLayer.fields
                .find(f => f.name === nestedVal(cellField, ['name']));
            const parentCell = parentLayer
                    && parentLayer.fields.find(f => f.name === nestedVal(cellField, ['name']));
            cellField = parentLayer && parentCell ? parentCell : originalCell;
            if (parentLayer) cellField = childLayerDomainValues(cellField, parentLayer);
            const currentAdminActive = activeAdminTool === activeTable.replace('.s', '')
                || (parentLayer && activeAdminTool === parentLayer.id);

            if (currentAdminActive) {
                const contentEditable = this.isCellEditable(cellField);
                const content = this.getCellContent(cellField, cellInfo);

                if (contentEditable) {
                    if (nestedVal(cellField, ['domain', 'type']) === 'codedValue'
                                || nestedVal(cellField, ['domain', 'type']) === 'coded-value') {
                        return this.renderSelect(cellField, content, cellInfo);
                    }

                    if (cellField && cellField.type === 'esriFieldTypeDate' && contentEditable) {
                        return this.renderDateInput(cellField, content, cellInfo);
                    }

                    return this.renderEditableDiv(
                        cellField,
                        cellField && cellField.type === 'esriFieldTypeDate'
                            ? toDisplayDate(content)
                            : content,
                        cellInfo,
                        contentEditable,
                    );
                }

                return this.renderDiv(
                    cellField,
                    cellField && cellField.type === 'esriFieldTypeDate'
                        ? toDisplayDate(content)
                        : content,
                );
            }

            const content = this.getCellContent(cellField, cellInfo);
            return this.renderDiv(
                cellField,
                cellField && cellField.type === 'esriFieldTypeDate'
                    ? toDisplayDate(content)
                    : content,
            );
        }

        return null;
    };

    renderFilter = (cellInfo: Object, filter: any, onChange: Function) => {
        const { layerList, activeTable } = this.props;
        const activeLayer = layerList.find(l => l.id === activeTable);
        let originalLayer: Object = layerList.find(l => l.id === activeTable.replace('.s', ''));
        originalLayer = originalLayer.parentLayer
            ? layerList.find(l => l.id === originalLayer.parentLayer)
            : originalLayer;

        if (activeLayer && activeLayer.fields) {
            let cellField = activeLayer.fields
                .find(f => `${activeTable}/${f.name}` === cellInfo.id);

            if (cellField) {
                if (originalLayer && originalLayer.fields) {
                    cellField = originalLayer.fields.some(f => f.name === cellField.name)
                        ? originalLayer.fields.find(f => f.name === cellField.name)
                        : cellField;

                    if (layerList.some(layer => layer.parentLayer === originalLayer.id)) {
                        cellField = childLayerDomainValues(cellField, originalLayer);
                    }
                }

                const domainType = nestedVal(cellField, ['domain', 'type']);
                if (domainType === 'codedValue' || domainType === 'coded-value') {
                    return this.renderSelectInput(cellField, cellInfo, filter, onChange);
                }

                return this.renderInput(
                    cellField,
                    filter,
                    onChange,
                );
            }
        }
        return null;
    };

    setTableInstance = (instance: Object) => {
        this.setState({ tableInstance: instance });
    };

    onFetchData = () => {
        const { tableInstance } = this.state;
        if (tableInstance) {
            const { setRowFilter } = this.props;
            const currentRecords = tableInstance.getResolvedState().sortedData;
            setRowFilter(currentRecords.map(r => ({
                id: r._original._id,
                layerId: r._original._layerId,
            })));
        }
    };

    render() {
        const {
            fetching,
            layerFeatures,
            selectAll,
            toggleSelectAll,
            layerList,
            setRowFilter,
            activeAdminTool,
            activeTable,
            activePage,
        } = this.props;

        const layerPage = layerFeatures && layerFeatures.id && activePage[layerFeatures.id];
        const currentPage = layerPage || 0;

        if (!layerFeatures) {
            return (
                <WrapperReactTableNoTable>
                    {strings.table.noTableText}
                </WrapperReactTableNoTable>
            );
        }

        if (!fetching && layerList) {
            const { columns, data } = layerFeatures;
            const { currentCellData } = this.state;

            const parentLayer = nestedVal(layerList
                .find(ll => ll.id === layerFeatures.id.replace('.s', '')),
            ['parentLayer']);
            const activeLayer: any = layerList.find(ll => ll.id === parentLayer)
                || layerList.find(ll => ll.id === layerFeatures.id);
            const relationLayer = activeLayer && activeLayer.relations
            && activeLayer.relations.length > 0
                ? layerList.find(ll => ll.id === String(activeLayer.relations
                    .find(r => r).relationLayerId))
                : null;

            const tableColumns = (activeLayer
                && activeLayer.relations
                && activeLayer.relations.length > 0
                && activeLayer.relations.find(r => r).relationType !== null
                && (!relationLayer || (relationLayer && relationLayer.layerPermission.readLayer)))
                ? addContractColumn(
                    this.handleContractClick,
                    columns,
                    isContract(activeLayer),
                )
                : columns;
            return (
                <ReactTableView
                    data={data}
                    toggleSelection={this.toggleSelection}
                    setRowFilter={setRowFilter}
                    columns={tableColumns}
                    selectAll={selectAll}
                    toggleSelectAll={() => toggleSelectAll(layerFeatures.id)}
                    renderCustomCell={this.renderCustomCell}
                    renderFilter={this.renderFilter}
                    currentCellData={currentCellData}
                    activeAdminTool={activeAdminTool}
                    activeTable={activeTable}
                    layerList={layerList}
                    setTableInstance={this.setTableInstance}
                    onFetchData={this.onFetchData}
                    onPageChange={this.handlePageChange}
                    activePage={currentPage}
                />
            );
        }
        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
