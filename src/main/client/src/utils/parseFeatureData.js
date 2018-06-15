export default {
    parseData: (data) => {
        if (!data && !data.layers && !data.layers.features && !data.features.layers) return [];
        const parsedData = [];
        data.layers.forEach(l => (l.features.forEach(f => parsedData.push(f.attributes))));
        return parsedData;
    },
    parseColumns: (data) => {
        if (!data && !data.layers && !data.layers.features && !data.features.layers) return [];
        const parsedColumns = [];
        data.layers.forEach(l =>
            (l.fields.forEach((f) => {
                if (parsedColumns.findIndex(item => item.accessor === f.name) === -1) {
                    parsedColumns.push({
                        Header: f.alias, accessor: f.name, show: true,
                    });
                }
            })));

        return parsedColumns;
    },
};
