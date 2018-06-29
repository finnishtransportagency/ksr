export const parseData = (data, selected, source) => {
    if (!data && !data.layers && !data.layers.features && !data.features.layers) return new Map();
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

export const parseDataFromArea = (data, selected, source) => {
    if (data.length < 1) return new Map();
    const parsedData = new Map();
    data.features.forEach((f) => {
        const key = `${f.layer.id}/${f.attributes[f.layer.objectIdField]}`;
        parsedData.set(key, {
            ...f.attributes,
            _id: f.attributes[f.layer.objectIdField],
            _layerId: f.layer.id,
            _selected: selected,
            _key: key,
            _source: source,
        });
    });
    return parsedData;
};

export const parseFeatureColumns = (data, source) => {
    if (!data && !data.layers && !data.layers.features && !data.features.layers) return new Map();
    const parsedColumns = new Map();
    data.layers.forEach(l =>
        (l.fields.forEach((f) => {
            const key = f.name;
            parsedColumns.set(key, {
                Header: f.alias,
                accessor: f.name,
                show: true,
                _key: key,
                _source: source,
            });
        })));

    return parsedColumns;
};

export const parseFeatureColumnsFromArea = (data, source) => {
    if (!data || !data.features || data.length < 1) return new Map();
    const parsedColumns = new Map();
    data.fields.forEach((f) => {
        const key = f.name;
        parsedColumns.set(key, {
            Header: f.alias,
            accessor: f.name,
            show: true,
            _key: key,
            _source: source,
        });
    });

    return parsedColumns;
};

export const parseColumns = (data) => {
    if (!data) return new Map();
    const parsedColumns = new Map();
    data.forEach((f) => {
        const key = f.accessor;
        parsedColumns.set(key, {
            Header: f.Header,
            accessor: f.accessor,
            show: f.show,
        });
    });

    return parsedColumns;
};

/**
* Merge a Map into another Map.
*
* @param currentFeatures Map containing currentFeatures
* @param newFeatures Map containing incoming features. Will be merged with currentFeatures
* @param option Special handling for data
*
* @returns {data, dataFromSelect}   Data: values, that currently must be shown in the table
*                                   DataFromSelect: newly added features
*/
export const mergeData = (currentFeatures, newFeatures, option) => {
    const data = new Map(currentFeatures);

    // Special handling for deleting/clearing selected data
    if (option === 'remove') {
        data.forEach((ds) => {
            switch (ds._source) {
                case 'search':
                    data.delete(ds._key);
                    break;
                case 'select':
                    data.delete(ds._key);
                    break;
                default:
                    break;
            }
        });
        return { data };
    }

    if (newFeatures) {
        newFeatures.forEach((val, key) => {
            if (data.has(key)) {
                const cVal = data.get(key);
                cVal._selected = val._selected;
            } else {
                data.set(key, val);
            }
        });
    }

    return { data };
};

/**
* Merge a Map into another Map.
* Will merge two Maps containing column definitions.
*
* @param currentColumns Map containing current columns
* @param newColumns Map containing incoming columns. Will be merged with currentColumns
* @param option Special options for column data
*
* @returns {columns, columnsFromSelect} Columns: Columns that should be shown in the table
*                                       ColumnsFromSelect: Columns added in select-action
*/
export const mergeColumns = (currentColumns, newColumns, option) => {
    const columns = new Map(currentColumns);

    // Special handling for deleting/clearing selected columns
    if (option === 'remove') {
        columns.forEach((ds) => {
            switch (ds._source) {
                case 'select':
                    columns.delete(ds._key);
                    break;
                case 'search':
                    columns.delete(ds._key);
                    break;
                default:
                    break;
            }
        });
        return { columns };
    }

    if (newColumns) {
        newColumns.forEach((val, key) => {
            if (!columns.has(key)) {
                columns.set(key, val);
            }
        });
    }
    return { columns };
};
