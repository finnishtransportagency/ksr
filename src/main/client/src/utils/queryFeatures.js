// @flow

/**
 * Select features from given geometry.
 *
 * @param {Object} geometry Current features geometry.
 * @param {Object} view Esri map view.
 * @param {Function} selectFeatures Redux function that selects features.
 * @param {number} layerId Current features layer ID.
 *
 * @returns {Promise<Object[]>} Promise with found features.
 */
export const queryFeatures = (
    geometry: Object,
    view: Object,
    selectFeatures: Function,
    layerId?: Number,
) => {
    const query = {
        geometry,
        outFields: ['*'],
        returnGeometry: true,
    };
    const queries = [];
    const handleQueryResult = (layer, results, source) => ({
        id: layer.id,
        title: layer.title,
        objectIdFieldName: layer.objectIdField,
        features: results.features,
        fields: layer.fields,
        _source: source,
    });

    view.map.layers.forEach((layer) => {
        if (layer.queryFeatures && layer.visible) {
            if (!layerId) {
                if (layer.featureType === 'shapefile') {
                    queries.push(view.whenLayerView(layer)
                        .then(layerView => layerView.queryFeatures(query))
                        .then(results => handleQueryResult(layer, results, 'shapefile')));
                } else if (view.scale < layer.minScale && view.scale > layer.maxScale) {
                    if (!layer.definitionExpression) {
                        queries.push(layer.queryFeatures(query)
                            .then(results => handleQueryResult(layer, results, 'select')));
                    } else {
                        queries.push(view.whenLayerView(layer)
                            .then(layerView => layerView.queryFeatures(query))
                            .then(results => handleQueryResult(layer, results, 'search')));
                    }
                }
            } else if (layer.featureType === 'shapefile' && layer.id !== layerId) {
                queries.push(view.whenLayerView(layer)
                    .then(layerView => layerView.queryFeatures(query))
                    .then(results => handleQueryResult(layer, results, 'shapefile')));
            } else if (view.scale < layer.minScale
                && view.scale > layer.maxScale
                && layer.id !== layerId
            ) {
                if (!layer.definitionExpression) {
                    queries.push(layer.queryFeatures(query)
                        .then(results => handleQueryResult(layer, results, 'select')));
                } else {
                    queries.push(view.whenLayerView(layer)
                        .then(layerView => layerView.queryFeatures(query))
                        .then(results => handleQueryResult(layer, results, 'search')));
                }
            }
        }
    });

    return Promise.all(queries).then((layers) => {
        selectFeatures({ layers });
        return layers;
    });
};
