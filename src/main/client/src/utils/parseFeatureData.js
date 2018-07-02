/**
* Parse columns from Esri's fields Array. Returns
* react-table compatible columns Array.
*
* @param data Esri's fields Array
*
* @returns Array React-table compatible Array
*/
export const parseColumns = (data) => {
    if (!data) return [];
    return data.map(f => ({
        Header: f.alias,
        accessor: f.name,
        show: true,
    }));
};

/**
* Parse data from Esri's FeatureService JSON-response.
*
* @param data Content of FeatureService JSON-response
* @param selected Whether features should be marked as selected
* @param source Origin of features. 'select': map select action. 'search': search action
*
* @returns Array of layers holding respective features and columns
*/
export const parseData = (data, selected, source) => {
    if (data === undefined || data === null || data.layers === undefined) return [];
    return data.layers.map(l => ({
        id: l.id,
        title: l.title,
        columns: parseColumns(l.fields),
        data: l.features.map(f => ({
            ...f.attributes,
            _id: f.attributes[l.objectIdFieldName],
            _layerId: l.id,
            _selected: selected,
            _key: `${l.id}/${f.attributes[l.objectIdFieldName]}`,
            _source: source,
        })),
    }));
};

/**
* Merge two arrays of features. If features does not exists in
* currentData (matching done with '_id') then add it, otherwise
* only update its '_selected' attribute.
*
* @param currentData Array of current features
* @param newData Array of incoming features
*
* @returns Array of merged input arrays
*/
export const mergeData = (currentData, newData) => {
    // Remove features added in previous selection
    const data = currentData.filter(f => f._source !== 'select');
    newData.forEach((newFeature) => {
        const matchingFeature = data.find(f => f._id === newFeature._id);
        if (matchingFeature) {
            matchingFeature._selected = newFeature._selected;
        } else {
            data.push(newFeature);
        }
    });

    return data;
};

/**
* Merge two array of layers.
*
* @param currentLayers Array of current layers
* @param newLayers Array of new layers
* @param currentActiveTable Id of currently active table
*
* @returns {mergedLayers, activeTable}
*
* MergedLayers: newLayers merged with currentLayers.
* ActiveTable: id of active table.
*/
export const mergeLayers = (currentLayers, newLayers, currentActiveTable) => {
    const layers = currentLayers.reduce((filtered, cl) => {
        const data = cl.data.filter(f => f._source !== 'select');
        if (data.length > 0) {
            filtered.push({ ...cl, data });
        }
        return filtered;
    }, []);

    newLayers.forEach((nl) => {
        // Matching layer from current layers
        const matchingLayer = layers.find(c => c.id === nl.id);
        if (matchingLayer) {
            // Add or replace features in this layer
            matchingLayer.data = mergeData(matchingLayer.data, nl.data);
        } else {
            layers.push(nl);
        }
    });

    let activeTable = currentActiveTable;

    if (layers.find(l => l.id === activeTable) === undefined || activeTable === null) {
        if (layers.length > 0) {
            activeTable = layers[0].id;
        }
    }

    return { layers, activeTable };
};

/**
* Update columns array of given layer id.
*
* @param activeTable Id of the layer, whose columns to update
* @param columns Columns that should be placed in matching layer
* @param currentLayers Array of layers
*
* @returns Updated layers
*/
export const updateLayerColumns = (activeTable, columns, currentLayers) => (
    currentLayers.map(l => (l.id === activeTable ? { ...l, columns } : { ...l }))
);
