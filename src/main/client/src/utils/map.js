// @flow
import { loadModules } from 'esri-loader';
import { toast } from 'react-toastify';
import { layerData } from '../api/map/layerData';
import strings from '../translations';

/**
 * Fit map on the extent of given layers.
 *
 * @param {Array<Object>} layers Array of layers of type esri/layers/FeatureLayer.
 * @param {Object} view MapView of type esri/views/MapView.
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
        if (extents && extents.length === 1 && extents[0].height === 0 && extents[0].width === 0) {
            view.goTo({
                target: extents,
                scale: view.constraints.maxScale,
            });
        } else if (extents) {
            view.goTo(extents);
        }
    });
};

/**
 * Fit map to given scale and center point.
 *
 * @param {Array<any>} mapCenter Array of x and y coordinates.
 * @param {number} mapScale Scale of mapview.
 * @param {Object} view MapView of type esri/views/MapView.
 */
export const setCenterPoint = async (
    mapCenter: Array<any>,
    mapScale: number,
    view: Object,
) => {
    const [Point, SpatialReference] = await loadModules([
        'esri/geometry/Point',
        'esri/geometry/SpatialReference',
    ]);
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
};

/**
 * Add new layers to map view.
 * If search layers are present or added also fit map on the extent of search layers.
 *
 * @param {Array<Object>} layers Array of layers to be added
 * @param {Object} view Map view to which the layers are added
 * @param {boolean} isWorkspace Indicates if adding layers comes from loading workspace.
 * @param {boolean} isOverviewMap Indicates if adding layers comes from adding overviewMap.
 * @param {Object[]} layerList List of every layer.
 *
 * @returns {Object} Object containing failed layers.
 */
export const addLayers = async (
    layers: Array<Object>,
    view: Object,
    isWorkspace: boolean,
    isOverviewMap: boolean = false,
    layerList: Object[],
) => {
    const [esriConfig, WMSLayer, WMTSLayer, FeatureLayer] = await loadModules([
        'esri/config',
        'esri/layers/WMSLayer',
        'esri/layers/WMTSLayer',
        'esri/layers/FeatureLayer',
    ]);
    const searchLayers = [];
    const failedLayers = [];
    await Promise.all(layers.map(async (layer) => {
        if (!view.map.layers.some(l => l.id === layer.id)) {
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
                        legendEnabled: false,
                        sublayers: layer.layers ? layer.layers.split(',').map(l => ({ name: l, legendEnabled: false })) : null,
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
                        legendEnabled: false,
                        activeLayer: {
                            id: layer.layers,
                        },
                    }), layer.index);
                    break;
                case 'agfs': {
                    // Exclude parent layers being added to the map.
                    if (!layerList.some(l => l.parentLayer === layer.id)) {
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
                            refreshInterval: 5,
                            legendEnabled: false,
                        });

                        if (layer._source === 'search') {
                            searchLayers.push(fl);
                        }

                        view.map.add(fl, layer.index);
                    }
                    break;
                }
                default:
                    break;
            }

            if (!isOverviewMap) {
                const addedLayer = view.map.layers.find(l => l.id === layer.id);
                if (addedLayer && addedLayer.type !== 'agfl') {
                    await addedLayer
                        .when()
                        .catch(() => {
                            view.map.remove(view.map.findLayerById(addedLayer.id));
                            toast.error(`${strings.mapLayers.failedToLoadLayer} [${layer.name}]`);
                            failedLayers.push(layer.id);
                        });
                }
            }
        }
    }));

    if (searchLayers.length && !isWorkspace) {
        fitExtent(searchLayers, view);
    }

    return { failedLayers };
};

/**
 * Highlight given features on the map using ArcGIS JS highlight feature.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {Array<Object>} selectedFeatures Array of selected features.
 */
export const highlight = async (
    view: Object,
    selectedFeatures: Array<Object>,
) => {
    const [Query] = await loadModules(['esri/tasks/support/Query']);
    if (view) {
        const highlightFeatures = (layer: Object, layerView: Object, features: Object[]) => {
            if (layer.layerHighlight) {
                layer.layerHighlight.remove();
            }
            layer.layerHighlight = layerView.highlight(features);
        };

        view.map.layers.forEach((layer) => {
            if (layer.queryFeatures) {
                const ids = selectedFeatures
                    .filter(f => f._layerId === layer.id)
                    .map(f => parseInt(f._id, 10));
                const { objectIdField } = layer;

                if (!ids.length && layer.layerHighlight) {
                    // No selected features in the current layer so
                    // remove highlights and continue to next layer.
                    layer.layerHighlight.remove();
                    return;
                }

                if (layer.featureType === 'shapefile') {
                    view.whenLayerView(layer).then((layerView) => {
                        const queryView = new Query();
                        queryView.returnGeometry = true;
                        queryView.objectIds = ids;

                        layerView.queryFeatures(queryView)
                            .then((results) => {
                                if (results) {
                                    highlightFeatures(layer, layerView, results.features);
                                }
                            });
                    });
                } else {
                    view.whenLayerView(layer).then((layerView) => {
                        const query = {
                            where: `${objectIdField} IN (${ids.join(',')})`,
                            outFields: ['*'],
                            returnGeometry: true,
                        };
                        layer.queryFeatures(query).then((results) => {
                            if (results) {
                                highlightFeatures(layer, layerView, results.features);
                            }
                        });
                    });
                }
            }
        });
    }
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
export const drawPropertyArea = async (
    view: Object,
    features: Object[],
) => {
    const [Polygon, Graphic] = await loadModules([
        'esri/geometry/Polygon',
        'esri/Graphic',
    ]);
    const createPolygon = vertices => new Polygon({
        rings: vertices,
        spatialReference: view.spatialReference,
    });

    const createPolygonGraphic = (geometry, propertyId): any => new Graphic({
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
};

/**
 * Zoom to a single property area and highlight found property.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {string} propertyId Property's identifier.
 */
export const zoomToProperty = (
    view: Object,
    propertyId: string,
) => {
    const propertyGraphics = view.graphics
        .filter(graphic => graphic.id === 'propertyArea');

    if (propertyGraphics.length) {
        propertyGraphics.forEach((property) => {
            property.symbol = {
                type: 'simple-fill',
                style: 'solid',
                color: 'rgba(247, 69, 69, 0.75)',
                outline: {
                    color: '#444444',
                    width: 1,
                },
            };
        });

        const selectedProperty = propertyGraphics.filter(a => a.propertyId === propertyId);
        if (selectedProperty.length) {
            selectedProperty.forEach((property) => {
                property.symbol = {
                    type: 'simple-fill',
                    style: 'solid',
                    color: 'rgba(247, 69, 69, 1)',
                    outline: {
                        color: '#444444',
                        width: 2,
                    },
                };
            });
            view.goTo(selectedProperty.items);
        }
    }
};

/**
 * Adds layer fields and geometry type to layer if it doesn't already have them.
 *
 * @param {Object} layer Layer to query fields for.
 *
 * @returns {Promise<Object>} Layer with fields.
 */
export const getSingleLayerFields = async (layer: Object): Promise<Object> => {
    if (!layer.fields && (layer.type === 'agfs' || layer.type === 'agfl')) {
        const layerWithFields: Object = await layerData(layer.id);
        if (!layer.error) {
            layer.geometryType = layerWithFields.geometryType;
            layer.fields = layerWithFields.fields && layerWithFields.fields
                .map((f, index) => ({
                    value: index,
                    label: f.alias,
                    type: f.type,
                    name: f.name,
                    editable: f.editable,
                    nullable: f.nullable,
                    length: f.length,
                    domain: f.domain ? {
                        type: f.domain.type,
                        name: f.domain.name,
                        description: f.domain.description,
                        codedValues: f.domain.codedValues,
                    } : null,
                }));
        }
    }
    return layer;
};

/**
 * Zoom to given features.
 *
 * @param {Object} view Esri ArcGIS JS MapView.
 * @param {Object[]} features Features to zoom to.
 */
export const zoomToFeatures = async (view: Object, features: Object[]) => {
    const [Point, Polygon, Polyline] = await loadModules([
        'esri/geometry/Point',
        'esri/geometry/Polygon',
        'esri/geometry/Polyline',
    ]);
    const geometries = features.map((feature) => {
        if (feature.geometry.x && feature.geometry.y && !feature.geometry.__accessor__) {
            return new Point({
                x: feature.geometry.x,
                y: feature.geometry.y,
                spatialReference: { wkid: 3067 },
            });
        }

        if (feature.geometry.rings && !feature.geometry.__accessor__) {
            return new Polygon({
                rings: feature.geometry.rings,
                spatialReference: { wkid: 3067 },
            });
        }

        if (feature.geometry.paths && !feature.geometry.__accessor__) {
            return new Polyline({
                paths: feature.geometry.paths,
                spatialReference: { wkid: 3067 },
            });
        }
        return feature.geometry;
    });
    if (geometries && geometries.length === 1 && geometries[0].type === 'point') {
        view.goTo({
            target: geometries,
            scale: view.constraints.maxScale,
        });
    } else if (geometries) {
        view.goTo(geometries);
    }
};
