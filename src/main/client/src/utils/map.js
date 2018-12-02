// @flow
import esriLoader from 'esri-loader';

/**
* Fit map on the extent of given layers.
*
* @param layers esri/layers/FeatureLayer
* @param view esri/views/MapView
*/
export const fitExtent = (layers: Array<Object>, view: Object) => {
    const extentQueries = [];
    const extents = [];
    layers.forEach((layer) => {
        extentQueries.push(layer.queryExtent().then((response) => {
            if (response.count) extents.push(response.extent);
        }));
    });

    Promise.all(extentQueries).then(() => {
        view.goTo(extents);
    });
};

/**
 * Fit map to given scale and center point
 *
 * @param mapCenter array of x and y coordinates
 * @param mapScale scale of mapview
 * @param view esri/views/MapView
 */
export const setCenterPoint = (
    mapCenter: Array<any>,
    mapScale: number,
    view: Object,
) => {
    esriLoader
        .loadModules([
            'esri/geometry/Point',
            'esri/geometry/SpatialReference',
        ])
        .then(([
            Point,
            SpatialReference,
        ]) => {
            const epsg3067 = new SpatialReference(3067);

            const point = Point({
                x: mapCenter[0],
                y: mapCenter[1],
                spatialReference: epsg3067,
            });

            view.goTo({
                target: point,
                scale: mapScale,
            });
        });
};

/**
 * Add new layers to map view.
 * If search layers are present or added also fit map on the extent of search layers.
 *
 * @param {Array<Object>} layers Array of layers to be added
 * @param {Object} view Map view to which the layers are added
 * @param {boolean} isWorkspace indicates if adding layers comes from loading workspace.
 */
export const addLayers = (
    layers: Array<Object>,
    view: Object,
    isWorkspace: boolean,
) => esriLoader
    .loadModules([
        'esri/config',
        'esri/layers/WMSLayer',
        'esri/layers/WMTSLayer',
        'esri/layers/FeatureLayer',
    ])
    .then(([
        esriConfig,
        WMSLayer,
        WMTSLayer,
        FeatureLayer,
    ]) => {
        const searchLayers = [];
        layers.forEach((layer) => {
            if (layer.active && !view.map.layers.find(l => l.id === layer.id)) {
                esriConfig.request.trustedServers.push(layer.url);
                switch (layer.type) {
                    // sublayers split will work as long as name doesn't contain comma
                    case 'wms':
                        view.map.add(new WMSLayer({
                            id: layer.id,
                            url: layer.url,
                            copyright: layer.attribution,
                            maxScale: layer.maxScale,
                            minScale: layer.minScale,
                            opacity: layer.opacity,
                            visible: layer.visible,
                            title: layer.name,
                            sublayers: layer.layers ? layer.layers.split(',').map(l => ({ name: l })) : null,
                        }), layer.index);
                        break;
                    case 'wmts':
                        view.map.add(new WMTSLayer({
                            id: layer.id,
                            url: layer.url,
                            copyright: layer.attribution,
                            maxScale: layer.maxScale,
                            minScale: layer.minScale,
                            opacity: layer.opacity,
                            visible: layer.visible,
                            title: layer.name,
                            activeLayer: {
                                id: layer.layers,
                            },
                        }), layer.index);
                        break;
                    case 'agfs': {
                        const fl = new FeatureLayer({
                            id: layer.id,
                            url: layer.url,
                            layerId: layer.id,
                            copyright: layer.attribution,
                            maxScale: layer.maxScale,
                            minScale: layer.minScale,
                            opacity: layer.opacity,
                            visible: layer.visible,
                            title: layer.name,
                            outFields: ['*'],
                            definitionExpression: layer.definitionExpression,
                        });

                        if (layer._source === 'search') {
                            searchLayers.push(fl);
                        }

                        view.map.add(fl, layer.index);
                        break;
                    }
                    default:
                        break;
                }
            }
        });
        if (searchLayers.length && !isWorkspace) {
            fitExtent(searchLayers, view);
        }
    });

/**
 * Highlight given features on the map using ArcGIS JS highlight feature.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {Array<Object>} selectedFeatures Array of selected features.
 * @param {string }activeAdminTool Id of the current admin tool layer.
 */
export const highlight = (
    view: Object,
    selectedFeatures: Array<Object>,
    activeAdminTool: string,
) => {
    esriLoader
        .loadModules(['esri/tasks/support/Query'])
        .then(([Query]) => {
            if (view) {
                view.map.layers.forEach((layer) => {
                    if (layer.visible && layer.queryFeatures) {
                        const ids = selectedFeatures
                            .filter(f => f._layerId.startsWith(layer.id))
                            .map(f => parseInt(f._id, 10));

                        if (!ids.length && layer.layerHighlight) {
                            // No selected features in the current layer so
                            // remove highlights and continue to next layer.
                            layer.layerHighlight.remove();
                            return;
                        }

                        if (activeAdminTool && activeAdminTool === layer.id) {
                            view.whenLayerView(layer).then((layerView) => {
                                const query = {
                                    objectIds: ids,
                                    outFields: ['*'],
                                    returnGeometry: true,
                                };
                                layer.queryFeatures(query).then((res) => {
                                    if (res) {
                                        if (layer.layerHighlight) {
                                            layer.layerHighlight.remove();
                                        }
                                        layer.layerHighlight = layerView.highlight(res.features);
                                    }
                                });
                            });
                        } else if (!activeAdminTool) {
                            if (layer.featureType === 'shapefile') {
                                view.whenLayerView(layer).then((layerView) => {
                                    const queryView = new Query();
                                    queryView.returnGeometry = true;
                                    queryView.objectIds = ids;

                                    layerView.queryFeatures(queryView)
                                        .then((results) => {
                                            if (results) {
                                                if (layer.layerHighlight) {
                                                    layer.layerHighlight.remove();
                                                }
                                                layer.layerHighlight =
                                                    layerView.highlight(results.features);
                                            }
                                        });
                                });
                            } else {
                                view.whenLayerView(layer).then((layerView) => {
                                    const query = {
                                        objectIds: ids,
                                        outFields: ['*'],
                                        returnGeometry: true,
                                    };
                                    layer.queryFeatures(query).then((res) => {
                                        if (res) {
                                            if (layer.layerHighlight) {
                                                layer.layerHighlight.remove();
                                            }
                                            layer.layerHighlight =
                                                layerView.highlight(res.features);
                                        }
                                    });
                                });
                            }
                        }
                    }
                });
            }
        });
};

/**
 * Removes all graphics from esrimap with given id.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {string} graphicId Name of the graphic to be removed.
 */
export const removeGraphicsFromMap = (view: Object, graphicId: string) => {
    const graphicToBeRemoved = view.graphics
        .filter(graphic => graphic.id === graphicId);

    view.graphics.removeMany(graphicToBeRemoved);
};

/**
 * Zooms and creates new graphics for all property results.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {Object[]} features List of result features from query.
 */
export const drawPropertyArea = (
    view: Object,
    features: Object[],
) => {
    esriLoader
        .loadModules([
            'esri/geometry/Polygon',
            'esri/Graphic',
        ])
        .then(([
            Polygon,
            Graphic,
        ]) => {
            const createPolygon = vertices =>
                new Polygon({
                    rings: vertices,
                    spatialReference: view.spatialReference,
                });

            const createPolygonGraphic = (geometry, propertyId): any =>
                new Graphic({
                    geometry,
                    symbol: {
                        type: 'simple-fill',
                        style: 'solid',
                        color: 'rgba(247, 69, 69, 0.75)',
                        outline: {
                            color: '#444444',
                            width: 1,
                        },
                    },
                    id: 'propertyArea',
                    propertyId,
                });

            let propertyGraphics = [];
            features.forEach((property) => {
                propertyGraphics = property.geometry.coordinates.map((coordinates) => {
                    const geometry = createPolygon(coordinates);
                    const graphic = createPolygonGraphic(
                        geometry,
                        property.properties.propertyIdentifier,
                    );
                    view.graphics.add(graphic);
                    return [...propertyGraphics, graphic];
                });
            });
            view.goTo(propertyGraphics);
        });
};

/**
 * Zoom to a single property area and highlight found property.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {Object[]} propertyId Propertys identifier.
 */
export const zoomToProperty = (
    view: Object,
    propertyId: string,
) => {
    const propertyGraphics = view.graphics
        .filter(graphic => graphic.id === 'propertyArea');

    if (propertyGraphics.length) {
        propertyGraphics.forEach((property) => {
            property.symbol.color.a = 0.75;
            property.symbol.outline.width = 1;
        });

        const selectedProperty = propertyGraphics.filter(a => a.propertyId === propertyId);
        if (selectedProperty.length) {
            selectedProperty.forEach((property) => {
                property.symbol.color.a = 1;
                property.symbol.outline.width = 2;
            });
            view.goTo(selectedProperty);
        }
    }
};
