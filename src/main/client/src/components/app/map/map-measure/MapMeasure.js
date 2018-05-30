// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import MapMeasureView from './MapMeasureView';

type State = {
    view: {
        graphics: any,
    },
    value: string,
    active: string,
    draw: Function,
};

type Props = {
    view: {},
};

const initialState = {
    view: {
        graphics: {},
    },
    value: '',
    active: '',
    draw: () => {},
};

class MapMeasure extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.removeMeasurement = this.removeMeasurement.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        const { view } = newProps;

        if (view !== this.props.view) {
            this.setState({ view });
            this.mapMeasure(view);
        }
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
                const draw = new Draw({
                    view,
                });

                this.setState({ draw });

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

                const createGraphic = (geometry, style): any =>
                    new Graphic({
                        geometry,
                        symbol: {
                            type: 'simple-fill',
                            style,
                            color: [60, 180, 200, 0.5],
                            outline: {
                                color: '#444444',
                                width: 2,
                            },
                        },
                    });

                const drawPolygon = (evt) => {
                    const { vertices } = evt;
                    const polygon = createPolygon(vertices);
                    const graphic = createGraphic(polygon, 'solid');

                    view.graphics.removeAll();
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

                    if (area > 10000) {
                        area = `${parseFloat((area / 10000).toPrecision(2))} ha`;
                    } else if (area !== 0 && area < 10000) {
                        area = `${parseFloat(area.toPrecision(2))} m2`;
                    } else {
                        area = '';
                    }

                    this.setState({ value: area });
                };

                const drawLine = (evt) => {
                    const { vertices } = evt;
                    const line = createLine(vertices);
                    const graphic = createGraphic(line, 'none');

                    view.graphics.removeAll();
                    view.graphics.add(graphic);

                    let length = geometryEngine.geodesicLength(line, 'meters');

                    if (length > 1000) {
                        length = `${parseFloat((length / 1000).toPrecision(2))} km`;
                    } else if (length !== 0 && length < 1000) {
                        length = `${parseFloat(length.toPrecision(2))} m`;
                    } else {
                        length = '';
                    }

                    this.setState({ value: length });
                };

                const drawingMode = (geometry, drawGeometry) => {
                    const action = draw.create(geometry);
                    view.focus();
                    this.setState({ active: geometry, view });

                    action.on(
                        ['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'],
                        drawGeometry,
                    );
                };

                const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
                drawPolygonButton.addEventListener('click', () => {
                    this.removeMeasurement();
                    drawingMode('polygon', drawPolygon);
                });

                const drawLineButton = (document.getElementById: Function)('draw-line');
                drawLineButton.addEventListener('click', () => {
                    this.removeMeasurement();
                    drawingMode('polyline', drawLine);
                });
            });
    };

    removeMeasurement = () => {
        const { view, draw } = this.state;
        draw.reset();
        view.graphics.removeAll();
        this.setState({ value: '', active: '' });
    };

    render() {
        const { value, active } = this.state;

        return (
            <MapMeasureView
                value={value}
                active={active}
                removeMeasurement={this.removeMeasurement}
            />
        );
    }
}

export default MapMeasure;
