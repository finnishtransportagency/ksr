// @flow
import esriLoader from 'esri-loader';
import { mapHighlightStroke as highlightStroke } from '../components/ui/defaultStyles';
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
 * @param layers Array of layers to be added
 * @param view Map view to which the layers are added
 * @param searchLayers Array of search layers that already exist in map view
 */
export const addLayers = (
    layers: Array<Object>,
    view: Object,
    searchLayers: Array<Object>,
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
        layers.forEach((layer) => {
            if (layer.active && !view.map.layers.find(l => l.id === layer.id)) {
                esriConfig.request.corsEnabledServers.push(layer.url);
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
    });

/**
* Creates an esri.Graphic for highlight purposes from given geometry.
*
* Reason that this method takes Graphic and SpatialReference as parameters is
* that then we can keep this method synchonous. (No need for esri-loader).
*
* @param geometry esri.geometry.Geometry Geometry to be used in the Graphic
* @param srid Spatial reference identifier
* @param Graphic Graphic class, that is then used to create new objects.
* @param SpatialReference SpatialReference class, that is used to create a spatialRefence object.
*
* @returns Graphic Returns Graphic if geometry is one of supported types otherwise null.
*/
export const createGraphic = (
    geometry: Object,
    srid: number,
    Graphic: any,
    SpatialReference: any,
) => {
    if (
        geometry === null
        || geometry === undefined
        || srid === null
        || srid === undefined
    ) {
        return null;
    }
    const geometry3067 = geometry.clone();
    geometry3067.spatialReference = new SpatialReference(srid);
    switch (geometry.type) {
        case 'point':
            return new Graphic({
                geometry: geometry3067,
                symbol: {
                    type: 'simple-marker',
                    color: [0, 0, 0, 0],
                    style: 'circle',
                    size: 8,
                    outline: {
                        color: highlightStroke,
                        width: 1,
                    },
                },
                id: 'highlight',
            });
        case 'polygon':
            return new Graphic({
                geometry: geometry3067,
                symbol: {
                    type: 'simple-fill',
                    style: 'none',
                    outline: {
                        color: highlightStroke,
                        width: 1,
                    },
                },
                id: 'highlight',
            });
        case 'polyline':
            return new Graphic({
                geometry: geometry3067,
                symbol: {
                    type: 'simple-line',
                    style: 'solid',
                    color: highlightStroke,
                    width: 1,
                },
                id: 'highlight',
            });
        default:
            return null;
    }
};

/**
 * Highlight given features on the map.
 *
 * Features are highlighted by drawing new Graphics
 * using the geometries of selected features.
 * Graphics are added straight to MapView, and therefore
 * they will always be the topmost layer with zero transparency.
 *
 * @param view esri.views.MapView
 * @param selectedFeatures Array of selected features
 * @param activeAdminTool string id of current admin tool layer
 */
export const highlight = (
    view: Object,
    selectedFeatures: Array<Object>,
    activeAdminTool: string,
) => {
    esriLoader
        .loadModules([
            'esri/Graphic',
            'esri/geometry/SpatialReference',
            'esri/tasks/support/Query',
        ])
        .then(([
            Graphic,
            SpatialReference,
            Query,
        ]) => {
            if (view) {
                view.graphics.removeMany(view.graphics.filter(g => g.id === 'highlight'));
                view.map.layers.forEach((layer) => {
                    if (layer.visible && layer.queryFeatures) {
                        const ids = selectedFeatures
                            .filter(f => f._layerId.startsWith(layer.id))
                            .map(f => parseInt(f._id, 10));
                        if (activeAdminTool && activeAdminTool === layer.id) {
                            if (layer.featureType === 'shapefile') {
                                view.whenLayerView(layer).then((layerView) => {
                                    const queryView = new Query();
                                    queryView.returnGeometry = true;
                                    queryView.objectIds = ids;

                                    layerView.queryFeatures(queryView)
                                        .then((results) => {
                                            if (results) {
                                                const graphics = results.features
                                                    .map(rf => createGraphic(
                                                        rf.geometry,
                                                        view.spatialReference.wkid || 3067,
                                                        Graphic,
                                                        SpatialReference,
                                                    ))
                                                    .filter(g => g !== null);
                                                view.graphics.addMany(graphics);
                                            }
                                        });
                                });
                            } else {
                                const query = {
                                    objectIds: ids,
                                    outFields: ['*'],
                                    returnGeometry: true,
                                };
                                layer.queryFeatures(query).then((res) => {
                                    if (res) {
                                        const graphics = res.features
                                            .map(rf => createGraphic(
                                                rf.geometry,
                                                view.spatialReference.wkid || 3067,
                                                Graphic,
                                                SpatialReference,
                                            ))
                                            .filter(g => g !== null);
                                        view.graphics.addMany(graphics);
                                    }
                                });
                            }
                        } else if (!activeAdminTool) {
                            if (layer.featureType === 'shapefile') {
                                view.whenLayerView(layer).then((layerView) => {
                                    const queryView = new Query();
                                    queryView.returnGeometry = true;
                                    queryView.objectIds = ids;

                                    layerView.queryFeatures(queryView)
                                        .then((results) => {
                                            if (results) {
                                                const graphics = results.features
                                                    .map(rf => createGraphic(
                                                        rf.geometry,
                                                        view.spatialReference.wkid || 3067,
                                                        Graphic,
                                                        SpatialReference,
                                                    ))
                                                    .filter(g => g !== null);
                                                view.graphics.addMany(graphics);
                                            }
                                        });
                                });
                            } else {
                                const query = {
                                    objectIds: ids,
                                    outFields: ['*'],
                                    returnGeometry: true,
                                };
                                layer.queryFeatures(query).then((res) => {
                                    if (res) {
                                        const graphics = res.features
                                            .map(rf => createGraphic(
                                                rf.geometry,
                                                view.spatialReference.wkid || 3067,
                                                Graphic,
                                                SpatialReference,
                                            ))
                                            .filter(g => g !== null);
                                        view.graphics.addMany(graphics);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
};
