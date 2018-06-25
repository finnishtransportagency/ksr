// @flow
import esriLoader from 'esri-loader';

import React, { Component } from 'react';
import strings from '../../../translations';
import EsriMapView from './EsriMapView';

import { graphicsToEsriJSON } from '../../../utils/arcFormats';
import { getStreetViewLink } from '../../../utils/streetView';


type Props = {
    activeNav: string,
    layerList: Array<any>,
    fetching: boolean,
    isOpenTable: boolean,
    mapCenter: Array<number>,
    mapScale: number,
    selectFeatures: Function,
};

type State = {
    options: {
        container: string,
    },
    view: any,
};

const initialState = {
    options: {
        container: 'mapView',
    },
    view: null,
};

class EsriMap extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    componentDidUpdate(prevProps: Props) {
        const { fetching, layerList } = this.props;
        const { view } = this.state;

        if (prevProps.fetching !== fetching) {
            this.initMap();
        }

        if (
            prevProps.layerList.length > 0 &&
            prevProps.layerList !== layerList &&
            view && view.map
        ) {
            const layerListReversed = [...layerList].reverse();

            // Update layer settings
            layerListReversed.forEach((l, i) => {
                // Add layer to map
                if (l.active && !view.map.findLayerById(l.id.toString())) {
                    this.addActiveLayer(l, i);
                    layerListReversed[i].visible = true;
                }

                // Change layer opacity and visibility
                view.map.allLayers.forEach((layer) => {
                    if (layer && l.id.toString() === layer.id) {
                        const newLayer = layer;
                        newLayer.visible = l.visible;
                        newLayer.opacity = l.opacity;
                        if (!l.active) view.map.layers.remove(layer);
                        return newLayer;
                    }
                    return null;
                });

                // Change layer order
                view.map.reorder(view.map.findLayerById(`${l.id}`, i));
            });
        }
    }

    addActiveLayer = (activeLayer: any, layerIndex: number) => {
        esriLoader
            .loadModules([
                'esri/config',
                'esri/layers/WMSLayer',
                'esri/layers/WMTSLayer',
            ])
            .then(([
                esriConfig,
                WMSLayer,
                WMTSLayer,
            ]) => {
                const addWmsLayer = layer =>
                    this.state.view.map.add(new WMSLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        opacity: layer.opacity,
                        visible: true,
                        sublayers: [
                            {
                                name: layer.layers,
                            },
                        ],
                    }), layerIndex);

                const addWmtsLayer = layer =>
                    this.state.view.map.add(new WMTSLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        opacity: layer.opacity,
                        visible: true,
                        activeLayer: {
                            id: layer.layers,
                        },
                    }), layerIndex);

                esriConfig.request.corsEnabledServers.push(activeLayer.url);

                if (activeLayer.type === 'wms') addWmsLayer(activeLayer);
                if (activeLayer.type === 'wmts') addWmtsLayer(activeLayer);
            });
    };

    initMap = () => {
        esriLoader.loadCss('https://js.arcgis.com/4.7/esri/css/main.css');

        esriLoader
            .loadModules([
                'esri/config',
                'esri/views/MapView',
                'esri/Map',
                'esri/widgets/Locate',
                'esri/widgets/Track',
                'esri/widgets/ScaleBar',
                'esri/layers/WMSLayer',
                'esri/layers/WMTSLayer',
                'esri/layers/FeatureLayer',
                'esri/geometry/SpatialReference',
                'esri/widgets/Compass',
                'esri/geometry/Point',
            ])
            .then(([
                esriConfig,
                MapView,
                Map,
                Locate,
                Track,
                ScaleBar,
                WMSLayer,
                WMTSLayer,
                FeatureLayer,
                SpatialReference,
                Compass,
                Point,
            ]) => {
                const { container } = this.state.options;
                const { layerList, mapCenter, mapScale } = this.props;
                const layers = [];

                const addWmsLayer = layer =>
                    layers.push(new WMSLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        sublayers: [
                            {
                                name: layer.layers,
                            },
                        ],
                    }));

                const addWmtsLayer = layer =>
                    layers.push(new WMTSLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        activeLayer: {
                            id: layer.layers,
                        },
                    }));

                const addAgfsLayer = layer =>
                    layers.push(new FeatureLayer({
                        id: layer.id,
                        url: layer.url,
                        copyright: layer.attribution,
                        maxScale: layer.maxScale,
                        minScale: layer.minScale,
                        outFields: ['*'],
                    }));

                layerList.map((l) => {
                    esriConfig.request.corsEnabledServers.push(l.url);

                    if (l.visible && l.type === 'wms') addWmsLayer(l);
                    if (l.visible && l.type === 'wmts') addWmtsLayer(l);
                    if (l.visible && l.type === 'agfs') addAgfsLayer(l);
                    return null;
                });

                const map = new Map({
                    layers: [...layers].reverse(),
                });

                const epsg3067 = new SpatialReference(3067);

                const point = new Point({
                    x: mapCenter[0],
                    y: mapCenter[1],
                    spatialReference: epsg3067,
                });

                const view = new MapView({
                    container,
                    map,
                    center: point,
                    scale: mapScale,
                });

                const compass = new Compass({
                    view,
                });

                const locate = new Locate({
                    view,
                });

                const track = new Track({
                    view,
                });

                const scaleBar = new ScaleBar({
                    view,
                    unit: 'metric',
                });

                view.ui.move('zoom', 'top-right');
                view.ui.add(
                    [compass, locate, track, 'draw-polygon', 'draw-line'],
                    'top-right',
                );
                view.ui.add([scaleBar], 'bottom-left');

                view.on('click', (event) => {
                    event.stopPropagation();

                    if (event.button === 0) { // Should be primary click both on mouse and touch.
                        const swLink = getStreetViewLink(event.mapPoint.x, event.mapPoint.y);

                        view.popup.collapseEnabled = false;
                        view.popup.open({
                            title: strings.esriMap.destinationDetails,
                            location: event.mapPoint,
                            content: swLink,
                        });

                        const point = {
                            x: event.x,
                            y: event.y,
                        };

                        view.hitTest(point).then(({ results }) => {
                            const graphics = results.map(re => re.graphic);
                            const features = graphicsToEsriJSON(graphics);
                            this.props.selectFeatures(features);
                        });
                    }
                });

                this.setState({ view });
            });
    };

    render() {
        const { activeNav, isOpenTable } = this.props;
        const { view } = this.state;

        return <EsriMapView activeNav={activeNav} isOpenTable={isOpenTable} view={view} />;
    }
}

export default EsriMap;
