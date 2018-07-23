// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { resetMapTools } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import MapMeasureView from './MapMeasureView';

type State = {
    value: string,
    drawTools: boolean,
};

type Props = {
    view: any,
    draw: Object,
    sketchViewModel: Object,
    active: string,
    setActiveTool: Function,
};

const initialState = {
    value: '',
    drawTools: false,
};

class MapMeasure extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };

        this.removeMeasurement = this.removeMeasurement.bind(this);
        this.toggleDrawTools = this.toggleDrawTools.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        if (this.props.draw !== newProps.draw && newProps.draw.initialized) {
            this.mapMeasure();
        }
    }

    mapMeasure = () => {
        esriLoader
            .loadModules([
                'esri/geometry/Polygon',
                'esri/geometry/Polyline',
                'esri/Graphic',
                'esri/geometry/geometryEngine',
            ])
            .then(([Polygon, Polyline, Graphic, geometryEngine]) => {
                const {
                    view, draw, setActiveTool,
                } = this.props;

                const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
                const drawLineButton = (document.getElementById: Function)('draw-line');

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
                        geometry: geometry.extent.width ? geometry : null,
                        symbol: {
                            type: 'simple-fill',
                            style,
                            color: [60, 180, 200, 0.5],
                            outline: {
                                color: '#444444',
                                width: 2,
                            },
                        },
                        id: 'drawMeasure',
                    });

                const labelMeasure = (geometry, value) =>
                    new Graphic({
                        geometry: geometry.extent.center,
                        symbol: {
                            type: 'text',
                            color: '#000000',
                            text: value || '',
                            xoffset: 3,
                            yoffset: 3,
                            font: {
                                size: 16,
                                family: 'sans-serif',
                                weight: 'bold',
                            },
                        },
                        id: 'labelMeasure',
                    });

                const drawPolygon = (evt) => {
                    const { vertices } = evt;
                    const polygon = createPolygon(vertices);

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

                    if (area >= 10000) {
                        area = `${parseFloat((area / 10000).toFixed(2))} ha`;
                    } else if (area > 0 && area < 10000) {
                        area = `${parseFloat(area.toFixed(2))} m\xB2`;
                    } else {
                        area = '';
                    }

                    const graphic = createGraphic(polygon, 'solid');
                    const graphicLabelMeasure = labelMeasure(polygon, area);
                    view.graphics.map(g => g.id === 'drawMeasure' && view.graphics.remove(g));
                    view.graphics.map(g => g.id === 'labelMeasure' && view.graphics.remove(g));
                    view.graphics.add(graphic);
                    view.graphics.add(graphicLabelMeasure);

                    this.setState({ value: area });
                };

                const drawLine = (evt) => {
                    const { vertices } = evt;
                    const line = createLine(vertices);

                    let length = geometryEngine.planarLength(line, 'meters');

                    if (length >= 1000) {
                        length = `${parseFloat((length / 1000).toFixed(2))} km`;
                    } else if (length > 0 && length < 1000) {
                        length = `${parseFloat(length.toFixed(2))} m`;
                    } else {
                        length = '';
                    }

                    const graphic = createGraphic(line, 'none');
                    const graphicLabelMeasure = labelMeasure(line, length);
                    view.graphics.map(g => g.id === 'drawMeasure' && view.graphics.remove(g));
                    view.graphics.map(g => g.id === 'labelMeasure' && view.graphics.remove(g));
                    view.graphics.add(graphic);
                    view.graphics.add(graphicLabelMeasure);

                    this.setState({ value: length });
                };

                const drawingMode = (geometry, drawGeometry) => {
                    const action = draw.create(geometry);

                    view.focus();

                    action.on(
                        ['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'],
                        drawGeometry,
                    );

                    action.on('draw-complete', this.removeHighlight);
                };

                drawPolygonButton.addEventListener('click', () => {
                    if (this.props.active === 'drawPolygon') {
                        this.removeMeasurement();
                    } else {
                        this.removeMeasurement();
                        setActiveTool('drawPolygon');
                        drawingMode('polygon', drawPolygon);
                        drawPolygonButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawLineButton.addEventListener('click', () => {
                    if (this.props.active === 'drawPolyline') {
                        this.removeMeasurement();
                    } else {
                        this.removeMeasurement();
                        setActiveTool('drawPolyline');
                        drawingMode('polyline', drawLine);
                        drawLineButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });
            });
    };

    removeHighlight = () => {
        const { setActiveTool } = this.props;
        const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
        const drawLineButton = (document.getElementById: Function)('draw-line');
        drawPolygonButton.style.backgroundColor = styles.colorMain;
        drawLineButton.style.backgroundColor = styles.colorMain;
        setActiveTool('');
    };

    removeMeasurement = () => {
        const {
            view, draw, sketchViewModel, setActiveTool,
        } = this.props;
        this.removeHighlight();
        resetMapTools(draw, sketchViewModel, setActiveTool);
        view.graphics.map(g => g.id === 'drawMeasure' && view.graphics.remove(g));
        view.graphics.map(g => g.id === 'labelMeasure' && view.graphics.remove(g));
        this.setState({ value: '' });
        setActiveTool('');
    };

    toggleDrawTools = () => {
        const { drawTools } = this.state;

        this.setState({ drawTools: !drawTools });
    };

    render() {
        const { value, drawTools } = this.state;
        const { view } = this.props;

        return (
            <MapMeasureView
                value={value}
                removeMeasurement={this.removeMeasurement}
                view={view}
                toggleDrawTools={this.toggleDrawTools}
                drawTools={drawTools}
            />
        );
    }
}

export default MapMeasure;
