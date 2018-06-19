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
            prevProps.layerList !== layerList
        ) {
            if (view.map) {
                const layerListReversed = [...layerList].reverse();

                // Update layer settings
                layerListReversed.forEach((l, i) => {
                    // Change layer opacity and visibility
                    view.map.allLayers.forEach((layer) => {
                        if (parseInt(l.id, 10) === parseInt(layer.id, 10)) {
                            const newLayer = layer;
                            newLayer.visible = l.visible;
                            newLayer.opacity = l.opacity;
                            return newLayer;
                        }
                        return null;
                    });

                    // Change layer order
                    view.map.reorder(view.map.findLayerById(`${l.id}`, i));
                });
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
                'esri/widgets/Locate',
                'esri/widgets/Track',
                'esri/widgets/ScaleBar',
                'esri/layers/WMSLayer',
                'esri/layers/WMTSLayer',
                'esri/layers/FeatureLayer',
                'esri/geometry/SpatialReference',
                'esri/geometry/Extent',
            ])
            .then(([
                esriConfig,
                MapView,
                Map,
                Search,
                Locate,
                Track,
                ScaleBar,
                WMSLayer,
                WMTSLayer,
                FeatureLayer,
                SpatialReference,
                Extent,
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
                    center: mapCenter,
                    scale: mapScale,
                });

                const search = new Search({
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
                    [locate, track, 'draw-polygon', 'draw-line'],
                    'top-right',
                );
                view.ui.add([search], 'top-left');
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
