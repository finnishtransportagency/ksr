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
                'esri/layers/FeatureLayer',
            ])
            .then(([MapView, Map, Extent, FeatureLayer]) => {
                const {
                    zoom,
                    container,
                    extentData,
                    basemap,
                } = this.props.options;

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

                const featureLayer = new FeatureLayer({
                    url:
                        'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0',
                });

                map.add(featureLayer);

                this.addWidgets(view);
            });
    };

    addWidgets = (view: any) => {
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

                view.ui.add([search, locate, home], 'top-right');
                view.ui.move('zoom', 'top-right');
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
