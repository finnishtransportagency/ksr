// @flow

/**
 * Feature query that selects all intersecting features with currently active feature in popup
 *
 * Selecting ignores features in same layer
 *
 * @param layerId Number current features layer ID
 * @param geometry Object current features geometry
 * @param view Object esri map view
 * @param selectFeatures Function redux function that selects features
 *
 */
export const getIntersectFeatures = (
    layerId: Number,
    geometry: Object,
    view: Object,
    selectFeatures: Function,
) => {
    const query = {
        geometry,
        outFields: ['*'],
    };
    const queries = [];

    view.map.layers.forEach((layer) => {
        if (layer.queryFeatures) {
            if (layer.visible &&
                !layer.definitionExpression &&
                view.scale < layer.minScale &&
                view.scale > layer.maxScale &&
                layer.id !== layerId
            ) {
                queries.push(layer.queryFeatures(query).then(results => ({
                    id: layer.id,
                    title: layer.title,
                    objectIdFieldName: layer.objectIdField,
                    features: results.features,
                    fields: layer.fields,
                })));
            }
        }
    });

    Promise.all(queries).then(layers => selectFeatures({ layers }));
};