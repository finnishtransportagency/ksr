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

