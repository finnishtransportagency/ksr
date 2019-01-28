// @flow

/**
* Apply edited values from '_edited'-property (Object[]) into
* features real attributes. After that, initialize _edited into an
* empty Array.
*
* @param data Object A single feature
*
* @return Object Features edits applied, if any done
*
*/
export const clearEdits = (data: Object) => (
    Object.entries(data).reduce((a, c: [string, any]) => {
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
* @param data Object[] Array of layers data
* @param editFeatures Number[] Array of objectIds
*
* @return Object[] Array of data, where edits are applied
*/
export const handleData = (
    data: Object[],
    editFeatures: Number[],
): Object[] => data.map((d: Object) => (
    editFeatures.includes(d._id) ? clearEdits(d) : { ...d }
));

/**
* Applies edits on layers, which were succesfully saved.
*
* @param layers Object[] Array of maplayers
* @param edits Object[] Response from applyEdits from ArcGIS Server
*
* @return Object[] Array of maplayers, were edits are applied
*
*/
export const applyEdits = (
    layers: Object[],
    edits: Object[],
): Object[] => layers.map((layer: Object) => {
    const editLayer = edits.find(e => e.layerId === layer.id);
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
