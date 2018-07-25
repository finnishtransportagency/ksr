import React from 'react';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';

const CheckboxTableHOC = checkboxHOC(ReactTable);

class SelectableTable extends CheckboxTableHOC {
    rowSelector(row) {
        const checked = this.props.isSelected(row);
        const inputProps = {
            checked,
            onClick: this.props.toggleSelection,
            selectType: this.props.selectType,
            id: row._id,
            row,
        };
        return React.createElement(this.props.SelectInputComponent, inputProps);
    }
}

export default SelectableTable;
