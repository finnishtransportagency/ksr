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
};

type State = {
    currentCellData: {
        title: ?string,
        originalData: ?string | ?number,
        editedData: ?string | ?number,
        rowIndex: ?number,
        key: ?string,
    }
};

const defaultState = {
    currentCellData: {
        title: null,
        originalData: null,
        editedData: null,
        rowIndex: null,
        key: null,
    },
};

class ReactTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = defaultState;

        this.renderFilter = this.renderFilter.bind(this);
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
            // Add two extra pixels to prevent unintended scroll from appearing.
            const tbodyHeight = headerElement.clientHeight + filterElement.clientHeight + 2;
            bodyElement.style.height = `calc(100% - ${tbodyHeight}px)`;
        }

        const { currentCellData } = this.state;
        const { setTableEdited, layerFeatures } = this.props;

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
        const activeLayer = layerList.find(l => l.id === activeTable.replace('.s', ''));
        let className = '';

        if (activeLayer && activeAdminTool === activeLayer.id) {
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

    handleContractClick = (objectId: number) => {
        const {
            setActiveModal, setContractListInfo, activeTable, layerList,
        } = this.props;
        const layerId = activeTable.replace('.s', '');
        const layer = layerList.find(l => l.id === layerId);
        if (layer && layer.type === 'agfl' && layer.relationLayerId === null) {
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

    isCellEditable = (cellField: Object) => {
        const { activeAdminTool, layerList, activeTable } = this.props;

        const activeLayer = layerList.find(l => l.id === activeTable.replace('.s', ''));

        if (activeLayer) {
            return activeAdminTool === activeLayer.id
                && activeLayer._source !== 'shapefile'
                && activeLayer.layerPermission.updateLayer
                && cellField.editable
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
                onChange={event => onChange(event.target.value)}
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
                    if (contentEditable) {
                        const text = evt.target.innerText;

                        this.setState(prevState => ({
                            currentCellData: {
                                ...prevState.currentCellData,
                                editedData: getValue(cellField.type, text),
                            },
                        }));
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
            onChange={evt => onChange(evt.target.value)}
        />
    );

    renderEditable = (cellInfo: Object) => {
        const { layerList, activeTable } = this.props;
        const activeLayer = layerList.find(l => l.id === activeTable);
        const originalLayer = layerList.find(l => l.id === activeTable.replace('.s', ''));

        if (activeLayer && activeLayer.fields) {
            let cellField = activeLayer.fields
                .find(f => `${activeTable}/${f.name}` === cellInfo.column.id);

            if (cellField) {
                if (originalLayer && originalLayer.fields) {
                    // Get editable values for search layer fields
                    cellField = originalLayer.fields.find(f => f.name === cellField.name);
                }
                const contentEditable = this.isCellEditable(cellField);
                const content = this.getCellContent(cellField, cellInfo);

                if (cellField.domain
                    && (cellField.domain.type === 'codedValue'
                        || cellField.domain.type === 'coded-value')
                    && contentEditable) {
                    return this.renderSelect(cellField, content, cellInfo);
                }

                if (cellField.type === 'esriFieldTypeDate' && contentEditable) {
                    return this.renderDateInput(cellField, content, cellInfo);
                }

                return this.renderDiv(
                    cellField,
                    cellField.type === 'esriFieldTypeDate' ? toDisplayDate(content) : content,
                    cellInfo,
                    contentEditable,
                );
            }
        }
        return null;
    };

    renderFilter = (cellInfo: Object, filter: any, onChange: Function) => {
        const { layerList, activeTable } = this.props;
        const activeLayer = layerList.find(l => l.id === activeTable);
        const originalLayer = layerList.find(l => l.id === activeTable.replace('.s', ''));

        if (activeLayer && activeLayer.fields) {
            let cellField = activeLayer.fields
                .find(f => `${activeTable}/${f.name}` === cellInfo.id);

            if (cellField) {
                if (originalLayer && originalLayer.fields) {
                    // Get editable values for search layer fields
                    cellField = originalLayer.fields.find(f => f.name === cellField.name);
                }

                if (cellField.domain
                    && (cellField.domain.type === 'codedValue'
                        || cellField.domain.type === 'coded-value')) {
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

    render() {
        const {
            fetching,
            layerFeatures,
            selectAll,
            toggleSelectAll,
            layerList,
            setRowFilter,
        } = this.props;

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

            const activeLayer: any = layerList.find(ll => ll.id === layerFeatures.id);
            const relationLayer = activeLayer
                && layerList.find(ll => ll.id === String(activeLayer.relationLayerId));
            const tableColumns = (activeLayer
                && activeLayer.relationType !== null
                && (!relationLayer || (relationLayer && relationLayer.layerPermission.readLayer)))
                ? addContractColumn(
                    this.handleContractClick,
                    columns,
                    activeLayer.type === 'agfl' && activeLayer.relationLayerId === null,
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
                    renderEditable={this.renderEditable}
                    renderFilter={this.renderFilter}
                    currentCellData={currentCellData}
                />
            );
        }
        return <LoadingIcon loading={fetching} />;
    }
}

export default ReactTable;
