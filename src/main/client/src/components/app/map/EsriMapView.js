// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { Wrapper } from './styles';

type Props = {
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

class EsriMapView extends Component<Props, void> {
    componentDidMount() {
        this.initMap();
    }

    initMap = () => {
        esriLoader
            .loadModules([
                'esri/views/MapView',
                'esri/Map',
                'esri/geometry/Extent',
            ])
            .then(([MapView, Map, Extent]) => {
                const {
                    zoom,
                    container,
                    extentData,
                    basemap,
                } = this.props.options;

                const map = new Map({
                    basemap,
                });

                this.mapLayers(map);

                const extent = new Extent({ ...extentData });

                const view = new MapView({
                    container,
                    map,
                    extent,
                    zoom,
                });

                this.mapWidgets(view);
            });
    };

    mapWidgets = (view: any) => {
        esriLoader
            .loadModules([
                'esri/widgets/Search',
                'esri/widgets/Home',
                'esri/widgets/Locate',
            ])
            .then(([Search, Home, Locate]) => {
                const search = new Search({
                    view,
                });

                const home = new Home({
                    view,
                });

                const locate = new Locate({
                    view,
                });

                view.ui.move('zoom', 'top-right');
                view.ui.add([locate, home], 'top-right');
                view.ui.add([search], 'top-left');
                view.ui.remove('attribution');
            });
    };

    mapLayers = (map: any) => {
        esriLoader
            .loadModules(['esri/layers/FeatureLayer'])
            .then(([FeatureLayer]) => {
                const featureLayer = new FeatureLayer({
                    url:
                        'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0',
                });

                map.add(featureLayer);
            });
    };

    render() {
        return (
            <Wrapper>
                <div id="mapView" />
            </Wrapper>
        );
    }
}

export default EsriMapView;
