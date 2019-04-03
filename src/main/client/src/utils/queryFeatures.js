// @flow
import esriLoader from 'esri-loader';

/**
 * Select features from given geometry.
 *
 * @param {Object} geometry Current features geometry.
 * @param {Object} view Esri map view.
 * @param {Function} selectFeatures Redux function that selects features.
 * @param {number} layerId Current features layer ID.
 */
export const queryFeatures = (
    geometry: Object,
    view: Object,
    selectFeatures: Function,
    layerId?: Number,
) => {
    esriLoader
        .loadModules([
            'esri/geometry/SpatialReference',
            'esri/geometry/Extent',
            'esri/tasks/support/Query',
        ])
        .then(([
            SpatialReference,
            Extent,
            Query,
        ]) => {
            const query = {
                geometry,
                outFields: ['*'],
                returnGeometry: true,
            };

            const queries = [];

            view.map.layers.forEach((layer) => {
                if (layer.queryFeatures && layer.visible) {
                    if (!layerId) {
                            const epsg3067 = new SpatialReference(3067);
                        if (layer.featureType === 'shapefile') {
                            view.whenLayerView(layer).then((layerView) => {
                                const queryView = new Query();
                                queryView.geometry = new Extent({
                                    xmin: geometry.extent.xmin,
                                    ymin: geometry.extent.ymin,
                                    xmax: geometry.extent.xmax,
                                    ymax: geometry.extent.ymax,
                                    spatialReference: epsg3067,
                                });
                                queries.push(layerView.queryFeatures(queryView)
                                    .then(results => ({
                                        id: layer.id,
                                        title: layer.title,
                                        objectIdFieldName: layer.objectIdField,
                                        features: results.features,
                                        fields: layer.fields,
                                        _source: 'shapefile',
                                    })));
                            });
                        } else if (!layer.definitionExpression
                            && view.scale < layer.minScale
                            && view.scale > layer.maxScale
                        ) {
                            queries.push(layer.queryFeatures(query)
                                .then(results => ({
                                    id: layer.id,
                                    title: layer.title,
                                    objectIdFieldName: layer.objectIdField,
                                    features: results.features,
                                    fields: layer.fields,
                                    _source: 'select',
                                })));
                        }
                        const epsg3067 = new SpatialReference(3067);
                    } else if (layer.featureType === 'shapefile' && layer.id !== layerId) {
                        view.whenLayerView(layer).then((layerView) => {
                            const queryView = new Query();
                            queryView.geometry = new Extent({
                                xmin: geometry.extent.xmin,
                                ymin: geometry.extent.ymin,
                                xmax: geometry.extent.xmax,
                                ymax: geometry.extent.ymax,
                                spatialReference: epsg3067,
                            });
                            queries.push(layerView.queryFeatures(queryView)
                                .then(results => ({
                                    id: layer.id,
                                    title: layer.title,
                                    objectIdFieldName: layer.objectIdField,
                                    features: results.features,
                                    fields: layer.fields,
                                    _source: 'shapefile',
                                })));
                        });
                    } else if (!layer.definitionExpression
                        && view.scale < layer.minScale
                        && view.scale > layer.maxScale
                        && layer.id !== layerId
                    ) {
                        queries.push(layer.queryFeatures(query)
                            .then(results => ({
                                id: layer.id,
                                title: layer.title,
                                objectIdFieldName: layer.objectIdField,
                                features: results.features,
                                fields: layer.fields,
                                _source: 'select',
                            })));
                    }
                }
            });
            Promise.all(queries).then(layers => selectFeatures({ layers }));
        });
};
