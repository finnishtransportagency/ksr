// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';

type Props = {
    activeNav: string,
};

type State = {
    view: {},
    options: {
        zoom: number,
        container: string,
        basemap: string,
        center: Array<number>,
    },
};

const initialState = {
    view: {},
    options: {
        basemap: 'topo',
        container: 'mapView',
        zoom: 16,
        center: [25, 60.3],
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
                'esri/views/MapView',
                'esri/Map',
                'esri/widgets/Search',
                'esri/widgets/Home',
                'esri/widgets/Track',
            ])
            .then(([MapView, Map, Search, Home, Track]) => {
                const {
                    zoom,
                    container,
                    center,
                    basemap,
                } = this.state.options;

                const map = new Map({
                    basemap,
                });

                const view = new MapView({
                    container,
                    map,
                    center,
                    zoom,
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
