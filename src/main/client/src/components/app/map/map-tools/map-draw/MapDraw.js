// @flow
import uuidv4 from 'uuid/v4';
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { resetMapTools, removeTemporaryDrawings } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import MapDrawView from './MapDrawView';

type Props = {
    view: any,
    draw: Object,
    sketchViewModel: Object,
    active: string,
    setActiveTool: Function,
    setActiveToolMenu: Function,
    drawText: string,
    isActive: boolean,
    hasGraphics: boolean,
    setHasGraphics: (hasGraphics: boolean) => void,
    showMeasurements: boolean,
    toggleMeasurements: () => void,
};

class MapDraw extends Component<Props, null> {
    currentGraphicUUID: ?string; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.currentGraphicUUID = null;

        this.removeDrawings = this.removeDrawings.bind(this);
        this.toggleDrawTools = this.toggleDrawTools.bind(this);
        this.toggleMeasurements = this.toggleMeasurements.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        if (this.props.draw !== newProps.draw && newProps.draw.initialized) {
            this.mapDraw();
        } else if (this.props.active !== newProps.active
                    && this.props.active === 'drawText'
                    && newProps.active === '') {
            this.removeHighlightFromButton('draw-text');
        }
    }

    mapDraw = () => {
        esriLoader
            .loadModules([
                'esri/geometry/Polygon',
                'esri/geometry/Polyline',
                'esri/geometry/Point',
                'esri/Graphic',
                'esri/geometry/geometryEngine',
            ])
            .then(([Polygon, Polyline, Point, Graphic, geometryEngine]) => {
                const {
                    view, draw, setActiveTool,
                } = this.props;

                const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
                const drawLineButton = (document.getElementById: Function)('draw-line');
                const drawPointButton = (document.getElementById: Function)('draw-point');
                const drawTextButton = (document.getElementById: Function)('draw-text');
                const drawEraseButton = (document.getElementById: Function)('draw-erase');
                const drawToggleMeasurementsButton = (document.getElementById: Function)('toggle-measurements');

                const measureArea = (polygon: Object) => {
                    let planarArea = geometryEngine.planarArea(
                        polygon,
                        'square-meters',
                    );
                    if (planarArea < 0) {
                        const simplifiedPolygon = geometryEngine.simplify(polygon);
                        if (simplifiedPolygon) {
                            planarArea = geometryEngine.planarArea(
                                simplifiedPolygon,
                                'square-meters',
                            );
                        }
                    }

                    let area = '';
                    if (planarArea >= 10000) {
                        area = `${parseFloat((planarArea / 10000).toFixed(2))} ha`;
                    } else if (planarArea > 0 && planarArea < 10000) {
                        area = `${parseFloat(planarArea.toFixed(2))} m\xB2`;
                    }
                    return area;
                };

                const measureLength = (line: Object) => {
                    const planarLength = geometryEngine.planarLength(line, 'meters');
                    let length = '';
                    if (planarLength >= 1000) {
                        length = `${parseFloat((planarLength / 1000).toFixed(2))} km`;
                    } else if (planarLength > 0 && planarLength < 1000) {
                        length = `${parseFloat(planarLength.toFixed(2))} m`;
                    }
                    return length;
                };

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

                const createPoint = coordinates =>
                    new Point({
                        x: coordinates[0],
                        y: coordinates[1],
                        spatialReference: view.spatialReference,
                    });

                const createPolygonGraphic = (geometry, style, complete): any =>
                    new Graphic({
                        geometry: geometry.extent.width ? geometry : null,
                        symbol: {
                            type: 'simple-fill',
                            style,
                            color: [102, 0, 102, 0.5],
                            outline: {
                                color: '#470047',
                                width: 2,
                            },
                        },
                        type: 'draw-graphic',
                        complete,
                        id: this.currentGraphicUUID,
                    });

                const createPolylineGraphic = (geometry, complete): any =>
                    new Graphic({
                        geometry: geometry.extent.width ? geometry : null,
                        symbol: {
                            type: 'simple-line',
                            color: '#660066',
                            width: 2,
                        },
                        type: 'draw-graphic',
                        complete,
                        id: this.currentGraphicUUID,
                    });

                const createPointGraphic = (geometry, complete): any =>
                    new Graphic({
                        geometry,
                        symbol: {
                            type: 'simple-marker',
                            color: '#660066',
                            path: `M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0
                                192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535
                                13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817
                                80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z`,
                            size: '24px',
                            yoffset: '12px',
                        },
                        type: 'draw-graphic',
                        complete,
                        id: this.currentGraphicUUID,
                    });

                const createTextGraphic = (geometry, complete): any => {
                    const { drawText } = this.props;
                    if (drawText && drawText.trim().length > 0) {
                        return new Graphic({
                            geometry,
                            symbol: {
                                type: 'text',
                                color: '#000',
                                text: this.props.drawText,
                                font: {
                                    size: 12,
                                    weight: 'bold',
                                },
                            },
                            type: 'draw-graphic',
                            complete,
                            id: this.currentGraphicUUID,
                        });
                    }
                    return null;
                };

                const createLabelGraphic = (geometry, value, complete) =>
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
                        type: 'draw-measure-label',
                        complete,
                        id: this.currentGraphicUUID,
                        visible: this.props.showMeasurements,
                    });

                const drawPolygon = (evt) => {
                    const { vertices } = evt;

                    if (vertices.length === 2) {
                        const line = createLine(vertices);
                        const graphic = createPolylineGraphic(line, evt.type === 'draw-complete');
                        const graphicsToRemove = view.graphics
                            .filter(g => g.id === this.currentGraphicUUID);

                        view.graphics.removeMany(graphicsToRemove);
                        view.graphics.add(graphic);
                    } else {
                        const polygon = createPolygon(vertices);
                        const area = measureArea(polygon);
                        const graphic = createPolygonGraphic(polygon, 'solid', evt.type === 'draw-complete');
                        const graphicLabelMeasure = createLabelGraphic(polygon, area, evt.type === 'draw-complete');
                        const graphicsToRemove = view.graphics
                            .filter(g => g.id === this.currentGraphicUUID);

                        view.graphics.removeMany(graphicsToRemove);
                        view.graphics.addMany([graphic, graphicLabelMeasure]);
                    }
                };

                const drawLine = (evt) => {
                    const { vertices } = evt;
                    const line = createLine(vertices);
                    const length = measureLength(line);
                    const graphic = createPolylineGraphic(line, evt.type === 'draw-complete');
                    const graphicLabelMeasure = createLabelGraphic(line, length, evt.type === 'draw-complete');

                    const graphicsToRemove = view.graphics
                        .filter(g => g.id === this.currentGraphicUUID);
                    view.graphics.removeMany(graphicsToRemove);

                    view.graphics.addMany([graphic, graphicLabelMeasure]);
                };

                const drawPoint = (evt) => {
                    const { coordinates } = evt;
                    const point = createPoint(coordinates);

                    const graphic = createPointGraphic(point, evt.type === 'draw-complete');

                    view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));
                    view.graphics.add(graphic);
                };

                const drawText = (evt) => {
                    const { coordinates } = evt;
                    const point = createPoint(coordinates);

                    const graphic = createTextGraphic(point, evt.type === 'draw-complete');

                    view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));

                    if (graphic !== null) {
                        view.graphics.add(graphic);
                    }
                };

                const drawingMode = (geometry, drawGeometry) => {
                    const action = draw.create(geometry);
                    this.currentGraphicUUID = uuidv4();

                    view.focus();

                    if (geometry === 'polygon' || geometry === 'polyline') {
                        action.on(
                            ['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'],
                            drawGeometry,
                        );
                    } else if (geometry === 'point') {
                        action.on(['cursor-update', 'draw-complete'], drawGeometry);
                    }

                    action.on('draw-complete', this.removeHighlight);
                };

                drawPolygonButton.addEventListener('click', () => {
                    if (this.props.active === 'drawPolygon') {
                        this.resetCurrentTool();
                    } else {
                        setActiveTool('drawPolygon');
                        drawingMode('polygon', drawPolygon);
                        this.removeHighlightsFromButtons('draw-polygon');
                        drawPolygonButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawLineButton.addEventListener('click', () => {
                    if (this.props.active === 'drawPolyline') {
                        this.resetCurrentTool();
                    } else {
                        setActiveTool('drawPolyline');
                        drawingMode('polyline', drawLine);
                        this.removeHighlightsFromButtons('draw-line');
                        drawLineButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawPointButton.addEventListener('click', () => {
                    if (this.props.active === 'drawPoint') {
                        this.resetCurrentTool();
                    } else {
                        setActiveTool('drawPoint');
                        drawingMode('point', drawPoint);
                        this.removeHighlightsFromButtons('draw-point');
                        drawPointButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawTextButton.addEventListener('click', () => {
                    if (this.props.active === 'drawText') {
                        this.resetCurrentTool();
                    } else {
                        setActiveTool('drawText');
                        drawingMode('point', drawText);
                        this.removeHighlightsFromButtons('draw-text');
                        drawTextButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawEraseButton.addEventListener('click', () => {
                    if (this.props.active === 'drawErase') {
                        this.resetCurrentTool();
                    } else {
                        this.resetCurrentTool();
                        setActiveTool('drawErase');
                        this.removeHighlightsFromButtons('draw-erase');
                        drawEraseButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawToggleMeasurementsButton.addEventListener('click', () => {
                    this.toggleMeasurements();
                });
            });
    };

    removeHighlightFromButton = (id: ?string) => {
        const button = (document.getElementById: Function)(id);
        if (button) {
            button.style.backgroundColor = styles.colorMain;
        }
    };

    removeHighlightsFromButtons = (exceptButton: ?string) => {
        ['draw-polygon', 'draw-line', 'draw-point', 'draw-text', 'draw-erase']
            .filter(i => i !== exceptButton)
            .forEach(b => this.removeHighlightFromButton(b));
        removeTemporaryDrawings(this.props.view);
    };

    removeHighlight = () => {
        const { setActiveTool, view, setHasGraphics } = this.props;

        this.removeHighlightsFromButtons();

        setActiveTool('');

        const hasGraphics = view
            && view.graphics
            && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
        setHasGraphics(hasGraphics);
    };

    removeDrawings = () => {
        const {
            view, draw, sketchViewModel, setActiveTool, setHasGraphics,
        } = this.props;
        this.removeHighlight();
        resetMapTools(draw, sketchViewModel, setActiveTool);

        const graphicsToRemove = view.graphics
            .filter(g => (g.type === 'draw-graphic' || g.type === 'draw-measure-label'));
        view.graphics.removeMany(graphicsToRemove);
        setActiveTool('');

        const hasGraphics = view
            && view.graphics
            && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
        setHasGraphics(hasGraphics);
    };

    toggleDrawTools = () => {
        const { isActive, setActiveToolMenu } = this.props;
        if (isActive) {
            setActiveToolMenu('');
        } else {
            setActiveToolMenu('drawTools');
        }
    };

    resetCurrentTool = () => {
        const { draw, setActiveTool } = this.props;

        setActiveTool('');
        draw.reset();
        this.removeHighlightsFromButtons();
    };

    toggleMeasurements = () => {
        const { view, toggleMeasurements } = this.props;
        toggleMeasurements();
        if (view.graphics.length) {
            const graphicsToBeRemoved = [];
            const graphicsToBeAdded = [];
            view.graphics.forEach((g) => {
                if (g.type === 'draw-measure-label') {
                    // JS API 4 does not support hiding and showing graphics based on visibility so
                    // as a workaround the graphics must be cloned and attributes set manually.
                    const cloned = g.clone();
                    cloned.complete = g.complete;
                    cloned.id = g.id;
                    cloned.type = g.type;
                    cloned.visible = !g.visible;

                    graphicsToBeRemoved.push(g);
                    graphicsToBeAdded.push(cloned);
                }
            });

            view.graphics.removeMany(graphicsToBeRemoved);
            view.graphics.addMany(graphicsToBeAdded);
        }
    };

    render() {
        const {
            view,
            isActive,
            hasGraphics,
            showMeasurements,
        } = this.props;

        return (
            <MapDrawView
                hasGraphics={hasGraphics}
                removeDrawings={this.removeDrawings}
                view={view}
                toggleDrawTools={this.toggleDrawTools}
                isActive={isActive}
                showMeasurements={showMeasurements}
            />
        );
    }
}

export default MapDraw;
