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
        extentData: {
            xmin: number,
            ymin: number,
            xmax: number,
            ymax: number,
            spatialReference: number,
        },
    },
};

const initialState = {
    view: {},
    options: {
        basemap: 'streets',
        container: 'mapView',
        zoom: 15,
        extentData: {
            xmin: -9177811,
            ymin: 4247000,
            xmax: -9176791,
            ymax: 4247784,
            spatialReference: 102100,
        },
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
                'esri/geometry/Extent',
                'esri/widgets/Search',
                'esri/widgets/Home',
                'esri/widgets/Track',
            ])
            .then(([MapView, Map, Extent, Search, Home, Track]) => {
                const {
                    zoom,
                    container,
                    extentData,
                    basemap,
                } = this.state.options;

                const map = new Map({
                    basemap,
                });

                const extent = new Extent({ ...extentData });

                const view = new MapView({
                    container,
                    map,
                    extent,
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
