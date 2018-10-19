import clone from 'clone';

/**
* Parse columns from Esri's fields Array. Returns
* react-table compatible columns Array.
*
* @param {string} id Layer id.
* @param {array} data Esri's fields Array.
*
* @returns Array React-table compatible Array
*/
export const parseColumns = (id, data) => {
    if (!data) return [];
    return data.map(f => ({
        Header: f.alias,
        accessor: `${id}/${f.name}`,
        show: true,
        editable: f.editable,
        nullable: f.nullable,
        length: f.length,
    }));
};

/**
 * Parse feature attributes to unique for each layer.
 *
 * @param {string} id Layer id.
 * @param {array} attributes Feature attributes.
 * @return {Object} Attributes contains layer id on the attribute name.
 */
export const parseAttributes = (id, attributes) => {
    const a = Object.entries(attributes);
    const newObject = {};
    for (let i = 0; i < a.length; i += 1) {
        Object.assign(newObject, { [`${id}/${a[i][0]}`]: a[i][1] });
    }
    return newObject;
};

/**
 * Parse data from Esri's FeatureService JSON-response.
 *
 * @param data Content of FeatureService JSON-response
 * @param selected Whether features should be marked as selected
 *
 * @returns Array of layers holding respective features and columns
 */

export const parseData = (data, selected) => {
    if (data === undefined || data === null || data.layers === undefined) return [];
    return data.layers.map(l => ({
        id: l.id,
        title: l.title,
        columns: parseColumns(l.id, l.fields),
        _source: l._source,
        _idFieldName: l.objectIdFieldName,
        data: l.features.map(f => ({
            ...parseAttributes(l.id, f.attributes),
            geometry: f.geometry,
            _id: f.attributes[l.objectIdFieldName],
            _layerId: l.id,
            _selected: f.selected !== undefined ? f.selected : selected,
            _edited: [],
            _key: `${l.id}/${f.attributes[l.objectIdFieldName]}`,
            _source: l._source,
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
    const data = [...currentData];
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
 * Returns id of active table.
 * If layer matching current id does not exists in layers,
 * then return id of first layer in layers-array or
 * if layers is empty then return empty string.
 *
 * @param layers Array of layers
 * @param currentActiveTable Id of currently active table
 *
 * @returns Id of active table
 */
export const getActiveTable = (layers, currentActiveTable) => {
    if (
        layers.find(l => l.id === currentActiveTable) === undefined
        || currentActiveTable === ''
    ) {
        if (layers.length > 0) {
            return layers[0].id;
        }
    }
    return layers.length === 0 ? '' : currentActiveTable;
};

/**
 * Merge two array of layers.
 *
 * @param currentLayers Array of current layers
 * @param newLayers Array of new layers
 * @param currentActiveTable Id of currently active table
 * @param clear Boolean which tells if feature should be cleared
 *
 * @returns {layers, editedLayers, activeTable}
 *
 * Layers: newLayers merged with currentLayers.
 * editedLayers: copy of layers,
 * ActiveTable: id of active table.
 */
export const mergeLayers = (currentLayers, newLayers, currentActiveTable, clear = false) => {
    const layers = currentLayers.map(l => ({ ...l, data: [...l.data] }));

    newLayers.forEach((nl) => {
        // Matching layer from current layers
        const matchingLayer = layers.find(c => c.id === nl.id);
        if (matchingLayer) {
            // Add or replace features in this layer
            if (clear) {
                matchingLayer.data = nl.data;
            } else {
                matchingLayer.data = mergeData(matchingLayer.data, nl.data);
            }
        } else if (nl.data.length) {
            layers.push(nl);
        }
    });

    const activeTable = getActiveTable(layers, currentActiveTable);
    const editedLayers = clone(layers, true, 3);

    return { layers, editedLayers, activeTable };
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

/**
 * Remove layers which are currently not active on the map. (layer.active === false)
 *
 * @param currentLayers Array of layers (table-reducer)
 * @param layerList Array of map-layers (layerGroup-reducer)
 * @param currentActiveTable Id of the currently active layer in table
 *
 * @returns { layers, editedLayers, activeTable }
 * layers: Filtered layers,
 * editedLayers: copy of layers,
 * activeTable: id of active table.
 */
export const syncWithLayersList = (currentLayers, layerList, currentActiveTable) => {
    const layers = currentLayers.filter(l => layerList.find(ll => (
        (ll.id === l.id && l.id.indexOf('.s') > 0) ||
        (ll.id === l.id && ll.active === true))) !== undefined);

    const editedLayers = clone(layers, true, 3);
    const activeTable = getActiveTable(layers, currentActiveTable);

    return { layers, editedLayers, activeTable };
};

/**
 * Deselects selected features from layers.
 * If layer contains no features, it will also be removed from table.
 *
 * @param currentLayers Array of layers (table-reducer)
 * @param currentActiveTable Id of the currently active layer in table
 *
 * @returns { layers, editedLayers, activeTable }
 * layers: Filtered layers,
 * editedLayers: copy of layers,
 * activeTable: id of active table.
 */
export const deSelectFeatures = (currentLayers, currentActiveTable) => {
    const layers = currentLayers.reduce((filtered, layer) => {
        const data = layer.data.reduce((fd, d) => {
            if (d._source === 'search') {
                fd.push({ ...d, _selected: false, _edited: [] });
            } else if (!d._selected) {
                fd.push({ ...d });
            }
            return fd;
        }, []);

        if (data.length > 0) {
            filtered.push({ ...layer, data });
        }
        return filtered;
    }, []);

    const editedLayers = clone(layers, true, 3);
    const activeTable = getActiveTable(layers, currentActiveTable);

    return { layers, editedLayers, activeTable };
};


/**
 * Toggles selected-state for given feature.
 * If feature is set unselected, it won't be removed from the table.
 *
 * @param currentLayers Array of layers (table-reducer)
 * @param feature Object of selected feature
 *
 * @returns layers Layers updated with features selection
 */
export const toggleSelection = (currentLayers, feature) => (
    currentLayers.map((layer) => {
        if (layer.id === feature._layerId) {
            return {
                ...layer,
                data: layer.data.map(d => ({
                    ...d,
                    _selected: d._id === feature._id ? !d._selected : d._selected,
                })),
            };
        }
        return { ...layer };
    })
);

/**
 * Set's all features on given layer either selected or unselected.
 *
 * @param currentLayers Array of layers (table-reducer)
 * @param layerId Id of the layer to select/unselect all features
 *
 * @returns layers Layers updates with features selected
 */
export const toggleSelectAll = (currentLayers, layerId) => (
    currentLayers.map((layer) => {
        if (layer.id === layerId) {
            const all = layer.data.find(d => !d._selected) === undefined;
            return {
                ...layer,
                data: layer.data.map(d => ({
                    ...d,
                    _selected: !all,
                })),
            };
        }
        return { ...layer };
    })
);
