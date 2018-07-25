// @flow

/**
 * Does validations about edited cell in table
 * Either adds new data to editedLayer or removes if original and edited matches
 *
 * @param evt Object edited cells event
 * @param layerData Array contains data from current table
 * @param cellField Object contains info about edited field
 * @param cellInfo Object contains info about edited cell
 *
 * @returns data Array that can be passed as edited layer
 */
export const cellEditValidate = (
    evt: Object,
    layerData: Array<Object>,
    cellField: Object,
    cellInfo: Object,
) => {
    const data = JSON.parse(JSON.stringify(layerData));
    const editedRow = data[cellInfo.index]._edited.find(d => d.title === cellInfo.column.id);
    const columnValue = data[cellInfo.index];
    const cellValue = data[cellInfo.index][cellInfo.column.id];

    const newValue = (value) => {
        columnValue._edited.push({
            title: cellInfo.column.id,
            originalData: cellValue,
            editedData: value,
        });
        data[cellInfo.index][cellInfo.column.id] = value;
    };

    if (!editedRow) {
        if (cellField.type === 'esriFieldTypeString') {
            if (cellValue.trim() !== evt.target.innerText) {
                if (evt.target.innerText) {
                    const value = evt.target.innerText;
                    newValue(value);
                } else {
                    const value = ' ';
                    newValue(value);
                }
            }
        } else if (cellField.type === 'esriFieldTypeSmallInteger' || cellField.type === 'esriFieldTypeInteger') {
            const value = parseInt(evt.target.innerText, 10);
            if (cellValue !== value) {
                if (evt.target.innerText) {
                    newValue(value);
                    data[cellInfo.index][cellInfo.column.id] = value;
                } else if (cellValue) {
                    newValue(0);
                    data[cellInfo.index][cellInfo.column.id] = 0;
                }
            }
        } else if (cellField.type === 'esriFieldTypeDouble') {
            if (cellValue !== parseFloat(evt.target.innerText)) {
                if (evt.target.innerText) {
                    const value = parseFloat(evt.target.innerText);
                    newValue(value);
                    data[cellInfo.index][cellInfo.column.id] = value;
                } else {
                    newValue(' ');
                    data[cellInfo.index][cellInfo.column.id] = ' ';
                }
            }
        }
    } else if (editedRow.editedData !== editedRow.originalData) {
        if (cellField.type === 'esriFieldTypeString') {
            if (editedRow.originalData === ' ' && !evt.target.innerText) {
                const value = ' ';
                editedRow.editedData = value;
                data[cellInfo.index][cellInfo.column.id] = value;
            } else {
                const value = evt.target.innerText;
                editedRow.editedData = value;
                data[cellInfo.index][cellInfo.column.id] = value;
            }
        } else if (cellField.type === 'esriFieldTypeSmallInteger' || cellField.type === 'esriFieldTypeInteger') {
            const value = parseInt(evt.target.innerText, 10);
            editedRow.editedData = !Number.isNaN(value)
                ? value
                : 0;
            data[cellInfo.index][cellInfo.column.id] = value;
        } else if (cellField.type === 'esriFieldTypeDouble') {
            const value = parseFloat(evt.target.innerText);
            editedRow.editedData = value;
            data[cellInfo.index][cellInfo.column.id] = value;
        }
    }

    if (editedRow) {
        if (editedRow.editedData === editedRow.originalData) {
            const foundIndex = columnValue._edited.indexOf(editedRow);
            if (foundIndex !== -1) {
                data[cellInfo.index][cellInfo.column.id] = editedRow.originalData;
                columnValue._edited.splice(foundIndex, 1);
            }
        }
    }

    return data;
};
