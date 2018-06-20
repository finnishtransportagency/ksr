// @flow
import esriLoader from 'esri-loader';
import proj4 from 'proj4';
import React, { Component } from 'react';
import strings from '../../../translations';
import EsriMapView from './EsriMapView';
import { defs } from '../../../utils/proj4Defs';

type Props = {
    activeNav: string,
    layerList: Array<any>,
    fetching: boolean,
    isOpenTable: boolean,
    mapCenter: Array<number>,
    mapScale: number,
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
                'esri/widgets/Search',
                'esri/widgets/Locate',
                'esri/widgets/Track',
                'esri/widgets/ScaleBar',
                'esri/layers/WMSLayer',
                'esri/layers/WMTSLayer',
                'esri/geometry/SpatialReference',
                'esri/geometry/Extent',
                'esri/widgets/Compass',
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
                SpatialReference,
                Extent,
                Compass,
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
                    center: mapCenter,
                    scale: mapScale,
                });

                const search = new Search({
                    view,
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
                view.ui.add([search], 'top-left');
                view.ui.add([scaleBar], 'bottom-left');

                proj4.defs(defs);

                view.on('click', (event) => {
                    event.stopPropagation();

                    const googleLocation =
                        proj4('EPSG:3067', 'EPSG:4326', [event.mapPoint.x, event.mapPoint.y]);
                    const streetViewUrl = `
                        https://www.google.com/maps/@?api=1&map_action=pano&` +
                        `viewpoint=${googleLocation[1]},${googleLocation[0]}`;

                    view.popup.collapseEnabled = false;
                    view.popup.open({
                        title: strings.esriMap.destinationDetails,
                        location: event.mapPoint,
                        content: `
                            <a href=${streetViewUrl} target="blank">${strings.esriMap.openGoogleStreetView}</a>
                        `,
                    });
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
