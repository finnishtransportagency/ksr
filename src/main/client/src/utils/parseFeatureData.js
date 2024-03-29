// @flow
import clone from 'clone';
import { notAllowedFields } from './fields';

/**
 * Get custom className for column if needed.
 *
 * @param {string} type Column type.
 * @param {string} name Column name.
 * @returns {string} Custom className if needed otherwise an empty string.
 */
const columnClassName = (type: string, name: string) => {
    let className;
    switch (type) {
        case 'double':
        case 'esriFieldTypeDouble':
            className = 'decimal';
            break;
        case 'date':
        case 'esriFieldTypeDate':
            className = 'date';
            break;
        default:
            className = '';
    }
    if ([
        'LAND_AREA',
        'LASKETTU_ALA',
        'P_ALA_BRM',
        'P_ALA_HTM',
        'SHAPE_AREA',
        'UNITS_RENTED_SUM',
        'UNITS',
    ].includes(name)) {
        className += className.length ? ' area' : 'area';
    }
    return className;
};

/**
 * Parse columns from Esri's fields Array. Returns
 * react-table compatible columns Array.
 *
 * @param {string} id Layer id.
 * @param {Object[]} data Esri's fields Array.
 *
 * @returns {Object[]} Array React-table compatible Array
 */
export const parseColumns = (id: string, data: Object[]): Object[] => {
    if (!data) return [];
    return data.map(f => ({
        Header: f.alias,
        accessor: `${id}/${f.name}`,
        show: f.type !== 'geometry'
            && !notAllowedFields.some(fieldName => fieldName === f.name.toLowerCase()),
        editable: f.editable,
        nullable: f.nullable,
        length: f.length,
        domain: f.domain ? {
            type: f.domain.type,
            name: f.domain.name,
            description: f.domain.description,
            codedValues: f.domain.codedValues,
        } : null,
        minWidth: f.type === 'esriFieldTypeDate' ? 140 : 100,
        className: columnClassName(f.type, f.name),
    }));
};

/**
 * Parse feature attributes to unique for each layer.
 *
 * @param {string} id Layer id.
 * @param {Object} attributes Feature attributes.
 * @return {Object} Attributes contains layer id on the attribute name.
 */
export const parseAttributes = (id: string, attributes: Object): { ... } => {
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
 * @param {Object} data Content of FeatureService JSON-response.
 * @param {boolean} selected Whether features should be marked as selected.
 *
 * @returns {Object[]} Array of layers holding respective features and columns.
 */
export const parseData = (data: Object, selected?: boolean): any => {
    if (data === undefined || data === null || data.layers === undefined) return [];
    return data.layers.filter(l => l)
        .map((l) => {
            const layerFeatures = l.source ? l.source.items : l.features;

            return {
                id: l.id,
                title: l.title,
                columns: parseColumns(l.id, l.fields),
                _source: l._source,
                _idFieldName: l.objectIdFieldName,
                data: layerFeatures.map(f => ({
                    ...parseAttributes(l.id, f.attributes),
                    geometry: f.geometry,
                    _id: f.attributes[l.objectIdFieldName],
                    _layerId: l.id,
                    _selected: f.selected !== undefined ? f.selected : selected,
                    _filtered: false,
                    _edited: [],
                    _key: `${l.id}/${f.attributes[l.objectIdFieldName]}`,
                    _source: l._source,
                })),
            };
        });
};

/**
 * Merge two arrays of features.
 *
 * If features do not exists in currentData (matching done with '_id') then add it; otherwise
 * remove existing features first before adding them back (update existing before delete might not
 * work because some features use duplicate IDs).
 *
 * @param {Object[]} currentData Array of current features.
 * @param {Object[]} newData Array of incoming features.
 *
 * @returns {Object[] } Array of merged input arrays.
 */
export const mergeData = (currentData: Object[], newData: Object[]): Array<any> => {
    const newFeatureIds = newData.map(d => d._id);
    return [...currentData]
        .filter(f => !newFeatureIds.some(nId => nId === f._id))
        .concat(newData);
};

/**
 * Returns id of active table.
 * If layer matching current id does not exists in layers,
 * then return id of first layer in layers-array or
 * if layers is empty then return empty string.
 *
 * @param {Object[]} layers Array of layers.
 * @param {string} currentActiveTable Id of currently active table.
 *
 * @returns {string} Id of active table.
 */
export const getActiveTable = (layers: Object[], currentActiveTable: string): any | string => {
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
 * @param {Object[]} currentLayers Array of current layers.
 * @param {Object[]} newLayers Array of new layers.
 * @param {string} currentActiveTable Id of currently active table.
 * @param {boolean} clear Boolean which tells if feature should be cleared.
 *
 * @returns {Object} Layer, editedLayers and activeTable.
 */
export const mergeLayers = (
    currentLayers: Object[],
    newLayers: Object[],
    currentActiveTable: string,
    clear: boolean = false,
): Object => {
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
 * @param {string} activeTable Id of the layer, whose columns to update.
 * @param {Object} columns Columns that should be placed in matching layer.
 * @param {Object[]} currentLayers Array of layers.
 *
 * @returns {Object[]} Updated layers.
 */
export const updateLayerColumns = (
    activeTable: string,
    columns: Object,
    currentLayers: Object[],
): Object[] => (
    currentLayers.map(l => (l.id === activeTable ? { ...l, columns } : { ...l }))
);

/**
 * Remove layers which are currently not active on the map.
 *
 * (layer.active === false)
 *
 * @param {Object[]} currentLayers Array of layers (table-reducer).
 * @param {Object[]} layerList Array of map-layers (layerGroup-reducer).
 * @param {string} currentActiveTable Id of the currently active layer in table.
 *
 * @returns {Object} layers, editedLayers and activeTable.
 */
export const syncWithLayersList = (
    currentLayers: Object[],
    layerList: Object[],
    currentActiveTable: string,
): Object => {
    const layers = currentLayers.filter(l => layerList.find(ll => (
        (ll.id === l.id && l.id.indexOf('_s') > 0)
        || (ll.id === l.id && ll.active === true))) !== undefined);

    const editedLayers = clone(layers, true, 3);
    const activeTable = getActiveTable(layers, currentActiveTable);

    return { layers, editedLayers, activeTable };
};

/**
 * Deselects selected features from layers.
 * If layer contains no features, it will also be removed from table.
 *
 * @param {Object[]} currentLayers Array of layers (table-reducer).
 * @param {string} currentActiveTable Id of the currently active layer in table.
 *
 * @returns {Object} layers, editedLayers, activeTable.
 */
export const deSelectFeatures: Object = (currentLayers: Object[], currentActiveTable: string) => {
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
 * Remove single feature from layer in table.
 *
 * @param {Object[]} currentLayers Array of layers (table-reducer).
 * @param {string} currentActiveTable Id of the currently active layer in table.
 * @param {string} layerId Layer id to be targeted in table.
 * @param {number} objectId Object to be removed from table features.
 * @param {string} objectIdFieldName Name of layer's object id field.
 *
 * @returns {Object} layers, editedLayers, activeTable.
 */
export const removeFeatureFromTable = (
    currentLayers: Object[],
    currentActiveTable: string,
    layerId: string,
    objectId: number,
    objectIdFieldName: string,
): { activeTable: any | string, editedLayers: empty, layers: Array<any>, ... } => {
    const layers: Object[] = currentLayers.map((layer) => {
        if (layer.id === layerId) {
            const objectIdField = `${layerId}/${objectIdFieldName}`;
            return {
                ...layer,
                data: layer.data.filter(d => d[objectIdField] !== objectId),
            };
        }
        return layer;
    }).filter(layer => layer.data.length > 0);

    const editedLayers = clone(layers, true, 3);
    const activeTable = getActiveTable(layers, currentActiveTable);

    return { layers, editedLayers, activeTable };
};

/**
 * Set filtered info for given features.
 *
 * @param {Object[]} currentLayers Array of layers (table-reducer).
 * @param {string} activeTable Currently filtered table.
 * @param {Object[]} features Object of selected features.
 *
 * @returns {Object[]} Layers updated with feature filtered information.
 */
export const setRowFilter: any = (
    currentLayers: Object[],
    activeTable: string,
    features: Object[],
): Object[] => (
    currentLayers.map((layer) => {
        if (layer.id === activeTable) {
            return {
                ...layer,
                data: layer.data.map(d => ({
                    ...d,
                    _filtered: !features.some(f => f.layerId === activeTable && d._id === f.id),
                })),
            };
        }
        return { ...layer };
    })
);

/**
 * Toggles selected-state for given feature.
 * If feature is set unselected, it won't be removed from the table.
 *
 * @param {Object[]} currentLayers Array of layers (table-reducer).
 * @param {Object} feature Object of selected feature.
 *
 * @returns {Object[]} Layers updated with features selection.
 */
export const toggleSelection = (currentLayers: Object[], feature: Object): Object[] => (
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
 * @param {Object[]} currentLayers Array of layers (table-reducer).
 * @param {string} layerId Id of the layer to select/unselect all features.
 *
 * @returns {Object[]} Layers updates with features selected.
 */
export const toggleSelectAll = (currentLayers: Object[], layerId: string): Object[] => (
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

/**
 * Gets the coded value for attribute.
 *
 * @param {Object} domain Field's domain containing coded value info.
 * @param {any} value Original value of the attribute.
 * @param {boolean} toString Cast code to string.
 *
 * @returns {string | number} Coded value for attribute.
 */
export const getCodedValue = (
    domain: Object,
    value: any,
    toString: boolean = false,
): string | number => {
    if (domain && (domain.type === 'codedValue' || domain.type === 'coded-value')) {
        const codedValue = domain.codedValues.find(cv => (toString
            ? String(cv.code) === value
            : cv.code === value));
        if (codedValue) {
            if (typeof value === 'string') {
                return codedValue.name.trim();
            }
            return codedValue.name;
        }
        return '';
    }
    return value;
};

/**
 * Merge Selected Feature columns with Layer Group columns by a key.
 *
 * @param {Object[]} selectedFeatureColumns Array of columns.
 * @param {Object[] }layerGroupColumns Array of columns.
 *
 * @returns {Object[]} Merged columns.
 */
export const mergeColumnsByHeaderAndLabel = (
    selectedFeatureColumns: Object[],
    layerGroupColumns: Object[],
): Object[] => selectedFeatureColumns.map(sfc => ({
    ...sfc,
    ...layerGroupColumns.find(lgc => (lgc.label === sfc.Header)),
}));
