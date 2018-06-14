// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';

type Props = {
    activeNav: string,
    layerList: Array<any>,
    fetching: boolean,
};

type State = {
    options: {
        container: string,
    },
};

const initialState = {
    options: {
        container: 'mapView',
    },
};

class EsriMap extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        (this: any).view = null;
    }

    componentDidUpdate(prevProps: Props) {
        const { fetching, layerList } = this.props;

        if (prevProps.fetching !== fetching) {
            this.initMap();
        }

        if (
            prevProps.layerList.length > 0 &&
            prevProps.layerList !== layerList
        ) {
            if ((this: any).view.map) {
                const layerListReversed = [...layerList].reverse();
                layerListReversed.map((l, i) =>
                    (this: any).view.map.reorder((this: any).view.map.findLayerById(`${l.id}`, i)));
            }
        }
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
                const { container } = this.state.options;
                const { layerList } = this.props;
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

                layerList.map((l) => {
                    esriConfig.request.corsEnabledServers.push(l.url);

                    if (l.visible && l.type === 'wms') addWmsLayer(l);
                    if (l.visible && l.type === 'wmts') addWmtsLayer(l);

                    return null;
                });

                const map = new Map({
                    layers: [...layers].reverse(),
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

                (this: any).view = view;
            });
    };

    render() {
        const { activeNav } = this.props;

        return <EsriMapView activeNav={activeNav} view={(this: any).view} />;
    }
}

export default EsriMap;
