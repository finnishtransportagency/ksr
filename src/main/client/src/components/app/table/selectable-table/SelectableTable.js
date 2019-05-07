import React from 'react';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';

const FixedColumns = withFixedColumns(ReactTable);
const CheckboxTableHOC = checkboxHOC(FixedColumns);

class SelectableTable extends CheckboxTableHOC {
    render() {
        const {
            columns: originalCols,
            selectWidth,
            ...rest
        } = this.props;
        let columns = [];
        const column = {
            id: '_selector',
            accessor: () => 'x',
            Header: this.headSelector.bind(this),
            Cell: ((ci) => {
                const checked = this.props.isSelected(ci.original);
                const inputProps = {
                    checked,
                    onClick: this.props.toggleSelection,
                    selectType: this.props.selectType,
                    id: ci.original._id,
                    row: ci.original,
                };
                return React.createElement(this.props.SelectInputComponent, inputProps);
            }),
            width: selectWidth || 30,
            filterable: false,
            sortable: false,
            resizable: false,
            style: { textAlign: 'center' },
        };

        if (originalCols.length && originalCols[0].fixed) {
            originalCols[0].columns.unshift(column);
            columns = [...originalCols];
        } else {
            const select = {
                Header: '',
                columns: [column],
                fixed: 'left',
            };
            columns = [select, ...originalCols];
        }

        return (
            <FixedColumns
                className="-striped -highlight"
                columns={columns}
                ref={(r) => { this.wrappedInstance = r; }}
                {...rest}
            />
        );
    }
}

export default SelectableTable;
