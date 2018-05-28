// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import MapMeasureView from './MapMeasureView';

type State = {
    value: string,
    draw: boolean,
};

type Props = {
    /* ... */
};

const initialState = {
    value: '',
    draw: false,
};

class MapMeasure extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.removeMeasurement = this.removeMeasurement.bind(this);
    }

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

                    let area = geometryEngine.planarArea(
                        polygon,
                        'square-meters',
                    );

                    if (area < 0) {
                        const simplifiedPolygon = geometryEngine.simplify(polygon);

                        if (simplifiedPolygon) {
                            area = geometryEngine.planarArea(
                                simplifiedPolygon,
                                'square-meters',
                            );
                        }
                    }

                    area = (area >= 10000 && area > 0)
                        ? `${parseFloat((area / 10000).toPrecision(2))} ha`
                        : `${parseFloat(area.toPrecision(2))} m2`;

                    this.setState({ value: area });
                };

                const drawLine = (evt) => {
                    const { vertices } = evt;

                    view.graphics.removeAll();

                    const line = createLine(vertices);

                    const graphic = createGraphic(line);
                    view.graphics.add(graphic);

                    let length = geometryEngine.planarLength(
                        line,
                        'meters',
                    );

                    length = (length >= 1000 && length > 0)
                        ? `${parseFloat((length / 1000).toPrecision(2))} km`
                        : `${parseFloat(length.toPrecision(2))} m`;

                    this.setState({ value: length });
                };

                const drawingMode = (draw, geometry, drawGeometry) => {
                    if (!this.state.draw) {
                        const action = draw.create(geometry);
                        view.focus();
                        this.setState({ draw: true });
                        action.on(
                            ['vertex-add', 'vertex-remove', 'draw-complete'],
                            drawGeometry,
                        );
                    } else {
                        draw.complete();
                        this.setState({ draw: false });
                        this.removeMeasurement(view);
                    }
                };

                const draw = new Draw({
                    view,
                });

                const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
                drawPolygonButton.addEventListener('click', () => {
                    this.removeMeasurement(view);
                    drawingMode(draw, 'polygon', drawPolygon);
                });

                const drawLineButton = (document.getElementById: Function)('draw-line');
                drawLineButton.addEventListener('click', () => {
                    this.removeMeasurement(view);
                    drawingMode(draw, 'polyline', drawLine);
                });
            });
    };

    removeMeasurement = (view: any) => {
        view.graphics.removeAll();
        this.setState({ value: '' });
    };

    render() {
        const { value } = this.state;

        return <MapMeasureView value={value} />;
    }
}

export default MapMeasure;
