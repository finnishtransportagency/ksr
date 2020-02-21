// @flow

/**
* Apply edited values from '_edited'-property (Object[]) into
* features real attributes. After that, initialize _edited into an
* empty Array.
*
* @param {Object} data Object A single feature.
* @return {Object} Object Features edits applied, if any done.
*/
export const clearEdits = (data: Object) => (
    Object.entries(data).reduce((a: Object, c: [string, any]) => {
        if (c[0] === '_edited' && Array.isArray(c[1])) {
            c[1].forEach((value) => {
                a[value.title] = value.editedData;
            });
            a._edited = [];
        }
        return a;
    }, { ...data })
);

/**
* Call's clearEdits -method for each feature, whose id is
* present in editFeatures -array.
*
* @param {Object[]} data Array of layers data.
* @param {number[]} editFeatures Array of objectIds.
* @return {Object[]} Array of data, where edits are applied.
*/
export const handleData = (
    data: Object[],
    editFeatures: number[],
): Object[] => data.map((d: Object) => (
    editFeatures.includes(d._id) ? clearEdits(d) : { ...d }
));

/**
* Applies edits on layers, which were succesfully saved.
*
* @param {Object[]} layers Array of maplayers.
* @param {Object[]} edits Response from applyEdits from ArcGIS Server.
* @return {Object[]} Array of maplayers, were edits are applied.
*/
export const applyEdits = (
    layers: Object[],
    edits: Object[],
): Object[] => layers.map((layer: Object) => {
    const editLayer = edits.find(e => e.layerId === layer.id.replace('.s', ''));
    if (editLayer) {
        return {
            ...layer,
            data: handleData(layer.data, editLayer.features),
        };
    }
    return { ...layer };
});

/**
 * Removes deleted features from table.
 *
 * @param {Object[]} layers List of map layers.
 * @param {string} objectIds String of feature IDs to be deleted, separated by commas.
 * @param {string} layerId ID of layer that the features will be deleted from.
 *
 * @returns {Object[]} List of map layers with deleted features removed.
 */
export const applyDeletedFeatures = (
    layers: Object[],
    objectIds: string,
    layerId: string,
): Object[] => layers.map((layer: Object) => {
    if (layerId === layer.id) {
        return {
            ...layer,
            data: layer.data.filter(d => !objectIds.includes(d._id)),
        };
    }
    return { ...layer };
}).filter((layer: Object) => layer.data.length);

/**
 * Handles edited columns that doesn't start with layer Id.
 *
 * @param {string} key Column's key.
 * @param {Object} data Edited data with columns.
 * @param {Object} foundData Found data with matching _id.
 *
 * @returns {Object} Column with original or new value.
 */
export const columnsWithoutLayerId = (key: string, data: Object, foundData: Object): Object => {
    const newTitle = edited => `${data._layerId}/${edited.title.split('/')[1]}`;

    return key === '_edited'
        ? { [key]: foundData._edited.map(edited => ({ ...edited, title: newTitle(edited) })) }
        : { [key]: data[key] };
};

/**
 * Handles edited columns that starts with layer Id and will change the data accordingly.
 *
 * e.g. for search layer '123/Objectid: 1' -> '123.s/Objectid: 1' when original layer edited.
 *
 * @param {string} key Column's key.
 * @param {Object} data Edited data with columns.
 * @param {Object} foundData Found data with matching _id.
 * @param {Object} editedLayerId Id of currently active layer in table.
 *
 * @returns {Object} Column with original or new data.
 */
export const columnsWithLayerId = (
    key: string,
    data: Object,
    foundData: Object,
    editedLayerId: string,
): Object => {
    const newKey = `${data._layerId}/${key.split('/')[1]}`;
    const newValue = foundData[`${editedLayerId}/${key.split('/')[1]}`];

    return foundData
        ? { [newKey]: newValue }
        : { [key]: data[key] };
};

/**
 * Handles getting data for original- and search layer.
 *
 * @param {Object} layer Found edited layer. Either original or search layer.
 * @param {Object[]} editedData Edited data sent to the feature reducer as action.
 *
 * @returns {Object[]} List with new edited data.
 */
export const findEditedData = (layer: Object, editedData: Object): Object[] => layer.data
    .map(data => ((editedData._id === data._id)
        ? Object.keys(data)
            .map((key) => {
                if (!key.startsWith(data._layerId)) {
                    return columnsWithoutLayerId(key, data, editedData);
                }

                return columnsWithLayerId(key, data, editedData, editedData._layerId);
            }).reduce((acc, cur) => Object.assign({}, acc, cur))
        : data));

/**
 * Handles edited layers for found- and search layer belonging to the layer.
 *
 * If layer has search layer active, editing the layer should also edit the search
 * layer and vice versa.
 *
 * @param {Object[]} editedLayers Feature reducers current edited layers.
 * @param {Object} editedData Edited data sent to the feature reducer as action.
 *
 * @returns {Object[]} List with new edited layers data.
 */
export const applyEditedLayers = (editedLayers: Object[], editedData: Object): Object[] => (
    editedLayers.map((editedLayer) => {
        const editedLayerId = editedData._layerId;

        if (editedLayer.id.replace('.s', '') === editedLayerId.replace('.s', '')) {
            return {
                ...editedLayer,
                data: findEditedData(editedLayer, editedData),
            };
        }

        return editedLayer;
    })
);

/**
 * Remove filters from given layer id.
 *
 * @param {Object[]} filtered Array of filter values.
 * @param {string} layerId Layer Id.
 *
 * @returns {Object[]} Array of filter values without given layer id filters.
 */
export const removeFilteredLayer = (filtered: Object[], layerId: string): Object[] => (
    filtered.filter(f => f.id.substring(0, f.id.indexOf('/')) !== layerId)
);

/**
 * Remove filters except from search layers.
 *
 * @param {Object[]} filtered Array of filter values.
 *
 * @returns {Object[]} Keeps array of filters from search layers.
 */
export const removeFilteredLayers = (filtered: Object[]): Object[] => (
    filtered.filter(f => f.id.substring(0, f.id.indexOf('/')).indexOf('.s') >= 0)
);
