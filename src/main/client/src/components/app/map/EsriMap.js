// @flow
import esriLoader from 'esri-loader';
import proj4 from 'proj4';
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';
import { defs } from '../../../utils/proj4Defs';

type Props = {
    activeNav: string,
    layerList: Array<any>,
    fetching: boolean,
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
                layerListReversed.map((l, i) =>
                    view.map.reorder(view.map.findLayerById(`${l.id}`, i)));
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
                'esri/widgets/ScaleBar',
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
                ScaleBar,
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

                const scaleBar = new ScaleBar({
                    view,
                    unit: 'metric',
                });

                view.ui.move('zoom', 'top-right');
                view.ui.add(
                    [track, home, 'draw-polygon', 'draw-line'],
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
                        title: 'Kohteen tiedot',
                        location: event.mapPoint,
                        content: `
                            <a href=${streetViewUrl} target="blank">Avaa Google Street View</a>
                        `,
                    });
                });

                this.setState({ view });
            });
    };

    render() {
        const { activeNav } = this.props;
        const { view } = this.state;

        return <EsriMapView activeNav={activeNav} view={view} />;
    }
}

export default EsriMap;
