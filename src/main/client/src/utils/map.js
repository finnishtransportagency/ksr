// @flow
import esriLoader from 'esri-loader';
import { mapHighlightStroke as highlightStroke } from '../components/ui/defaultStyles';

export const addLayer = (layer: Object, view: Object, index: number) => {
    esriLoader
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
            esriConfig.request.corsEnabledServers.push(layer.url);

            switch (layer.type) {
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
                        sublayers: [
                            {
                                name: layer.layers,
                            },
                        ],
                    }), index);
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
                    }), index);
                    break;
                case 'agfs':
                    view.map.add(new FeatureLayer({
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
                    }), index);
                    break;
                default:
                    break;
            }
        });
};

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
*/
export const highlight = (view: Object, selectedFeatures: Array<Object>) => {
    esriLoader
        .loadModules([
            'esri/Graphic',
            'esri/geometry/SpatialReference',
        ])
        .then(([
            Graphic,
            SpatialReference,
        ]) => {
            if (view) {
                view.graphics.removeMany(view.graphics.filter(g => g.id === 'highlight'));
                view.allLayerViews.forEach((lv) => {
                    const { layer } = lv;
                    if (layer.visible && layer.queryFeatures) {
                        const ids = selectedFeatures
                            .filter(f => f._layerId === layer.id)
                            .map(f => parseInt(f._id, 10));

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
                });
            }
        });
};
