export const parseData = (data, selected, source) => {
    if (!data && !data.layers && !data.layers.features && !data.features.layers) return [];
    const parsedData = new Map();
    data.layers.forEach((l) => {
        l.features.forEach((f) => {
            const key = `${l.id}/${f.attributes[l.objectIdFieldName]}`;
            parsedData.set(key, {
                ...f.attributes,
                _id: f.attributes[l.objectIdFieldName],
                _layerId: l.id,
                _selected: selected,
                _key: key,
                _source: source,
            });
        });
    });
    return parsedData;
};

export const parseColumns = (data) => {
    if (!data && !data.layers && !data.layers.features && !data.features.layers) return [];
    const parsedColumns = new Map();
    data.layers.forEach(l =>
        (l.fields.forEach((f) => {
            const key = f.name;
            parsedColumns.set(key, {
                Header: f.alias,
                accessor: f.name,
                show: true,
            });
        })));

    return parsedColumns;
};

/**
* Merge a Map into another Map.
*
* @param currentFeatures Map containing currentFeatures
* @param newFeatures Map containing incoming features. Will be merged with currentFeatures
* @param dataFromPreviousSelect Set containing keys of objects,
*                                that were added in previous select-action
*
* @returns {data, dataFromSelect}   Data: values, that currently must be shown in the table
*                                   DataFromSelect: newly added features
*/
export const mergeData = (currentFeatures, newFeatures, dataFromPreviousSelect) => {
    const data = new Map(currentFeatures);

    if (dataFromPreviousSelect) {
        dataFromPreviousSelect.forEach((ds) => {
            const feat = data.get(ds);
            switch (feat._source) { // eslint-disable-line no-underscore-dangle
                case 'search':
                    // Set previously selected features to unselected
                    feat._selected = false; // eslint-disable-line no-underscore-dangle
                    break;
                case 'select':
                    // Remove features added by previous selection
                    data.delete(ds);
                    break;
                default:
                    break;
            }
        });
    }

    const dataFromSelect = new Set();

    if (newFeatures) {
        newFeatures.forEach((val, key) => {
            if (data.has(key)) {
                const cVal = data.get(key);
                cVal._selected = val._selected; // eslint-disable-line no-underscore-dangle
            } else {
                data.set(key, val);
            }
            dataFromSelect.add(key);
        });
    }

    return { data, dataFromSelect };
};

/**
* Merge a Map into another Map.
* Will merge two Maps containing column definitions.
*
* @param currentColumns Map containing current columns
* @param newColumns Map containing incoming columns. Will be merged with currentColumns
* @param columnsFromSelect Columns added in previous select-action
*
* @returns {columns, columnsFromSelect} Columns: Columns that should be shown in the table
*                                       ColumnsFromSelect: Columns added in select-action
*/
export const mergeColumns = (currentColumns, newColumns, columnsFromPreviousSelect) => {
    const columns = new Map(currentColumns);
    columnsFromPreviousSelect.forEach(columns.delete, columns);

    const columnsFromSelect = new Set();

    if (newColumns) {
        newColumns.forEach((val, key) => {
            if (!columns.has(key)) {
                columns.set(key, val);
                columnsFromSelect.add(key);
            }
        });
    }
    return { columns, columnsFromSelect };
};
