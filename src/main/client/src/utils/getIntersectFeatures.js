export const getIntersectFeatures = (layerId, geometry, view, selectFeatures) => {
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
