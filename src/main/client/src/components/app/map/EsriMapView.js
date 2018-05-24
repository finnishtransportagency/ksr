// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { Wrapper } from './styles';

type Props = {
    activeNav: string,
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
        esriLoader.loadCss('https://js.arcgis.com/4.7/esri/css/main.css');
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

                const extent = new Extent({ ...extentData });

                const view = new MapView({
                    container,
                    map,
                    extent,
                    zoom,
                });

                view.ui.move('zoom', 'top-right');
                this.mapWidgets(view);
                this.mapDraw(view);
            });
    };

    mapWidgets = (view: any) => {
        esriLoader
            .loadModules([
                'esri/widgets/Search',
                'esri/widgets/Home',
                'esri/widgets/Track',
            ])
            .then(([Search, Home, Track]) => {
                const search = new Search({
                    view,
                });

                const home = new Home({
                    view,
                });

                const track = new Track({
                    view,
                });

                view.ui.add([track, home], 'top-right');
                view.ui.add([search], 'top-left');
            });
    };

    mapDraw = (view: any) => {
        esriLoader
            .loadModules([
                'esri/views/2d/draw/Draw',
                'esri/geometry/Polygon',
                'esri/geometry/Polyline',
                'esri/Graphic',
                'esri/geometry/geometryEngine',
            ])
            .then(([Draw, Polygon, Polyline, Graphic, geometryEngine]) => {
                const createPolygon = vertices => new Polygon({
                    rings: vertices,
                    spatialReference: view.spatialReference,
                });

                const createLine = vertices => new Polyline({
                    paths: vertices,
                    spatialReference: view.spatialReference,
                });

                const labelAreas = (geom, area) => {
                    const graphic = new Graphic({
                        geometry: geom.centroid,
                        symbol: {
                            type: 'text',
                            color: '#444444',
                            text:
                                area >= 10000
                                    ? `${(area / 10000).toFixed(2)} ha`
                                    : `${area.toFixed(2)} m/2`,
                            xoffset: 3,
                            yoffset: 3,
                            font: {
                                size: 16,
                                family: 'Arial',
                            },
                        },
                    });
                    view.graphics.add(graphic);
                };

                const createGraphic = (geometry): any =>
                    new Graphic({
                        geometry,
                        symbol: {
                            type: 'simple-fill',
                            style: 'none',
                            outline: {
                                color: '#444444',
                                width: 1,
                            },
                        },
                    });

                const drawPolygon = (evt) => {
                    const { vertices } = evt;

                    view.graphics.removeAll();

                    const polygon = createPolygon(vertices);

                    const graphic = createGraphic(polygon);
                    view.graphics.add(graphic);

                    let area = geometryEngine.geodesicArea(
                        polygon,
                        'square-meters',
                    );
                    if (area < 0) {
                        const simplifiedPolygon = geometryEngine.simplify(polygon);

                        if (simplifiedPolygon) {
                            area = geometryEngine.geodesicArea(
                                simplifiedPolygon,
                                'square-meters',
                            );
                        }
                    }
                    labelAreas(polygon, area);
                };

                const drawLine = (evt) => {
                    const { vertices } = evt;

                    view.graphics.removeAll();

                    const line = createLine(vertices);

                    const graphic = createGraphic(line);
                    view.graphics.add(graphic);

                    const length = geometryEngine.geodesicLength(
                        line,
                        'meters',
                    );

                    (document.getElementById: Function)('measurement').innerText = length >= 1000 && length > 0 ? `${(length / 1000).toFixed(2)} km` : `${length.toFixed(2)} m`;

                    labelAreas(line, length);
                };

                const enableCreatePolygon = (draw) => {
                    const action = draw.create('polygon');

                    view.focus();

                    action.on(
                        [
                            'vertex-add',
                            'cursor-update',
                            'vertex-remove',
                            'draw-complete',
                        ],
                        drawPolygon,
                    );
                };

                const enableCreateLine = (draw) => {
                    const action = draw.create('polyline');

                    view.focus();

                    action.on(
                        [
                            'vertex-add',
                            'cursor-update',
                            'vertex-remove',
                            'draw-complete',
                        ],
                        drawLine,
                    );
                };

                const draw = new Draw({
                    view,
                });

                const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
                drawPolygonButton.addEventListener('click', () => {
                    view.graphics.removeAll();
                    (document.getElementById: Function)('measurement').innerText = '';
                    enableCreatePolygon(draw);
                });

                const drawLineButton = (document.getElementById: Function)('draw-line');
                drawLineButton.addEventListener('click', () => {
                    view.graphics.removeAll();
                    (document.getElementById: Function)('measurement').innerText = '';
                    enableCreateLine(draw);
                });

                view.ui.add(['draw-polygon', 'draw-line'], 'top-right');
            });
    };

    render() {
        const { activeNav } = this.props;

        return (
            <Wrapper sideBar={activeNav}>
                <div id="mapView">
                    <div
                        id="draw-polygon"
                        className="esri-widget-button esri-widget esri-interactive"
                        title="Draw and measure polygon"
                    >
                        <span className="esri-icon-polygon" />
                    </div>
                    <div
                        id="draw-line"
                        className="esri-widget-button esri-widget esri-interactive"
                        title="Draw and measure line"
                    >
                        <span className="esri-icon-polyline" />
                    </div>
                    <div id="measurement" />
                </div>
            </Wrapper>
        );
    }
}

export default EsriMapView;
