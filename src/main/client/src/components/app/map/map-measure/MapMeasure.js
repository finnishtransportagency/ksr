// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import MapMeasureView from './MapMeasureView';

type State = {
    /* ... */
}

type Props = {
    /* ... */
}

class MapMeasure extends Component<Props, State> {
    componentWillReceiveProps(newProps: any) {
        const { view } = newProps;

        this.mapMeasure(view);
    }

    mapMeasure = (view: any) => {
        esriLoader
            .loadModules([
                'esri/views/2d/draw/Draw',
                'esri/geometry/Polygon',
                'esri/geometry/Polyline',
                'esri/Graphic',
                'esri/geometry/geometryEngine',
            ])
            .then(([Draw, Polygon, Polyline, Graphic, geometryEngine]) => {
                const createPolygon = vertices =>
                    new Polygon({
                        rings: vertices,
                        spatialReference: view.spatialReference,
                    });

                const createLine = vertices =>
                    new Polyline({
                        paths: vertices,
                        spatialReference: view.spatialReference,
                    });

                const createGraphic = (geometry): any =>
                    new Graphic({
                        geometry,
                        symbol: {
                            type: 'simple-fill',
                            style: 'none',
                            outline: {
                                color: '#444444',
                                width: 2,
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

                    (document.getElementById: Function)('measurement').style.display =
                        'block';
                    (document.getElementById: Function)('measurement').innerText =
                        area >= 10000 && area > 0
                            ? `${parseFloat((area / 10000).toPrecision(2))} ha`
                            : `${parseFloat(area.toPrecision(2))} m2`;
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

                    (document.getElementById: Function)('measurement').style.display =
                        'block';
                    (document.getElementById: Function)('measurement').innerText =
                        length >= 1000 && length > 0
                            ? `${parseFloat((length / 1000).toPrecision(2))} km`
                            : `${parseFloat(length.toPrecision(2))} m`;
                };

                const enableCreatePolygon = (draw) => {
                    const action = draw.create('polygon');

                    view.focus();

                    action.on(
                        ['vertex-add', 'vertex-remove', 'draw-complete'],
                        drawPolygon,
                    );
                };

                const enableCreateLine = (draw) => {
                    const action = draw.create('polyline');
                    view.focus();

                    action.on(
                        ['vertex-add', 'vertex-remove', 'draw-complete'],
                        drawLine,
                    );
                };

                const draw = new Draw({
                    view,
                });

                const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
                drawPolygonButton.addEventListener('click', () => {
                    view.graphics.removeAll();
                    (document.getElementById: Function)('measurement').style.display = 'none';
                    (document.getElementById: Function)('measurement').innerText = '';
                    enableCreatePolygon(draw);
                });

                const drawLineButton = (document.getElementById: Function)('draw-line');
                drawLineButton.addEventListener('click', () => {
                    view.graphics.removeAll();
                    (document.getElementById: Function)('measurement').style.display = 'none';
                    (document.getElementById: Function)('measurement').innerText = '';
                    enableCreateLine(draw);
                });
            });
    };

    render() {
        return <MapMeasureView />;
    }
}

export default MapMeasure;
