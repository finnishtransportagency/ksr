// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';

type SubLayers = {
    name: string,
};

type WmsLayer = {
    server: string,
    url: string,
    copyright: string,
    sublayers: Array<SubLayers>
}

type WmtsLayer = {
    server: string,
    url: string,
    copyright: string,
    activeLayer: {
        id: string,
    }
}

type Props = {
    wmsLayers: Array<WmsLayer>,
    wmtsLayers: Array<WmtsLayer>,
    activeNav: string,
    layerGroups: any,
}

type State = {
    view: {},
    options: {
        container: string,
    },
    layerGroups: Array<any>,
};

const initialState = {
    view: {},
    options: {
        container: 'mapView',
    },
    layerGroups: [],
};

class EsriMap extends Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = { ...initialState };
    }

    componentDidMount() {
        const { layerGroups } = this.props;

        layerGroups
            .then(r => this.setState({ layerGroups: r }))
            .then(this.initMap());
    }

    initMap = () => {
        esriLoader.loadCss('https://js.arcgis.com/4.7/esri/css/main.css');

        esriLoader
            .loadModules([
                'esri/config',
                'esri/views/MapView',
                'esri/Map',
                'esri/widgets/Search',
                'esri/widgets/Home',
                'esri/widgets/Track',
                'esri/layers/WMSLayer',
                'esri/layers/WMTSLayer',
                'esri/geometry/SpatialReference',
                'esri/geometry/Extent',
            ])
            .then(([
                esriConfig,
                MapView,
                Map,
                Search,
                Home,
                Track,
                WMSLayer,
                WMTSLayer,
                SpatialReference,
                Extent,
            ]) => {
                const { layerGroups } = this.state;
                const { container } = this.state.options;
                const { wmsLayers } = this.props;
                const layers = [];

                wmsLayers.map((layer) => {
                    esriConfig.request.corsEnabledServers.push(layer.server);
                    return layers.push(new WMSLayer({
                        url: layer.url,
                        copyright: layer.copyright,
                        sublayers: layer.sublayers,
                    }));
                });

                // Add visible WMS layers to array
                layerGroups.map(layerGroup => layerGroup.layers.map((layer) => {
                    esriConfig.request.corsEnabledServers.push(layer.url);

                    if (layer.visible && layer.type === 'wms') {
                        return layers.push(new WMSLayer({
                            url: layer.url,
                            copyright: layer.attribution,
                            sublayers: [
                                {
                                    name: layer.layers,
                                },
                            ],
                        }));
                    }
                    return null;
                }));

                // Add visible WMTS layers to array
                layerGroups.map(layerGroup => layerGroup.layers.map((layer) => {
                    esriConfig.request.corsEnabledServers.push(layer.url);

                    if (layer.visible && layer.type === 'wmts') {
                        return layers.push(new WMTSLayer({
                            url: layer.url,
                            copyright: layer.attribution,
                            activeLayer: {
                                id: layer.layers,
                            },
                        }));
                    }
                    return null;
                }));

                const map = new Map({
                    layers,
                });

                const epsg3067 = new SpatialReference(3067);

                const extent = new Extent({
                    xmin: -548576,
                    ymin: 6291456,
                    xmax: 1548576,
                    ymax: 8388608,
                    spatialReference: {
                        wkid: 3067,
                    },
                });

                const view = new MapView({
                    container,
                    map,
                    spatialReference: epsg3067,
                    extent,
                });

                const search = new Search({
                    view,
                });

                const home = new Home({
                    view,
                });

                const track = new Track({
                    view,
                });

                view.ui.move('zoom', 'top-right');
                view.ui.add(
                    [track, home, 'draw-polygon', 'draw-line'],
                    'top-right',
                );
                view.ui.add([search], 'top-left');

                this.setState({ view });
            });
    };

    render() {
        const { view } = this.state;
        const { activeNav } = this.props;

        return <EsriMapView activeNav={activeNav} view={view} />;
    }
}

export default EsriMap;
