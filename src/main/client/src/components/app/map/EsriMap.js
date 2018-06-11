// @flow
import esriLoader from 'esri-loader';
import proj4 from 'proj4';
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';
import { defs } from '../../../utils/proj4Defs';

type SubLayers = {
    name: string,
};

type WmsLayer = {
    server: string,
    url: string,
    copyright: string,
    sublayers: Array<SubLayers>
};

type WmtsLayer = {
    server: string,
    url: string,
    copyright: string,
    activeLayer: {
        id: string,
    }
};

type Props = {
    wmsLayers: Array<WmsLayer>,
    wmtsLayers: Array<WmtsLayer>,
    activeNav: string,
};

type State = {
    view: {},
    options: {
        container: string,
    },
};

const initialState = {
    view: {},
    options: {
        container: 'mapView',
    },
};

class EsriMap extends Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = { ...initialState };
    }

    componentDidMount() {
        this.initMap();
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
                SpatialReference,
                Extent,
            ]) => {
                const { container } = this.state.options;
                const { wmsLayers, wmtsLayers } = this.props;
                const layers = [];

                wmsLayers.map((layer) => {
                    esriConfig.request.corsEnabledServers.push(layer.server);
                    return layers.push(new WMSLayer({
                        url: layer.url,
                        copyright: layer.copyright,
                        sublayers: layer.sublayers,
                    }));
                });

                wmtsLayers.map((layer) => {
                    esriConfig.request.corsEnabledServers.push(layer.server);
                    return layers.push(new WMTSLayer({
                        url: layer.url,
                        copyright: layer.copyright,
                        activeLayer: layer.activeLayer,
                    }));
                });

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
        const { view } = this.state;
        const { activeNav } = this.props;

        return <EsriMapView activeNav={activeNav} view={view} />;
    }
}

export default EsriMap;
