// @flow
import uuidv4 from 'uuid/v4';
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { resetMapTools, removeTemporaryDrawings } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import MapDrawView from './MapDrawView';

type State = {
    hasGraphics: boolean,
};

type Props = {
    view: any,
    draw: Object,
    sketchViewModel: Object,
    active: string,
    setActiveTool: Function,
    setActiveToolMenu: Function,
    drawText: string,
    isActive: boolean,
};

const initialState = {
    hasGraphics: false,
};

class MapDraw extends Component<Props, State> {
    currentGraphicUUID: ?string; // eslint-disable-line react/sort-comp

    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
        this.currentGraphicUUID = null;

        this.removeDrawings = this.removeDrawings.bind(this);
        this.toggleDrawTools = this.toggleDrawTools.bind(this);
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
            ])
            .then(([Polygon, Polyline, Point, Graphic]) => {
                const {
                    view, draw, setActiveTool,
                } = this.props;

                const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
                const drawLineButton = (document.getElementById: Function)('draw-line');
                const drawPointButton = (document.getElementById: Function)('draw-point');
                const drawTextButton = (document.getElementById: Function)('draw-text');
                const drawEraseButton = (document.getElementById: Function)('draw-erase');

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

                const createGraphic = (geometry, style, complete): any =>
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

                const createPointGraphic = (geometry, complete): any =>
                    new Graphic({
                        geometry,
                        symbol: {
                            type: 'picture-marker',
                            url: 'images/map-marker.png',
                            width: '32px',
                            height: '32px',
                            yoffset: '16px',
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

                const drawPolygon = (evt) => {
                    const { vertices } = evt;
                    const polygon = createPolygon(vertices);

                    const graphic = createGraphic(polygon, 'solid', evt.type === 'draw-complete');
                    view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));
                    view.graphics.add(graphic);
                };

                const drawLine = (evt) => {
                    const { vertices } = evt;
                    const line = createLine(vertices);

                    const graphic = createGraphic(line, 'none', evt.type === 'draw-complete');

                    view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));
                    view.graphics.add(graphic);
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
                    if (this.props.active !== 'drawPolygon') {
                        setActiveTool('drawPolygon');
                        drawingMode('polygon', drawPolygon);
                        this.removeHighlightsFromButtons('draw-polygon');
                        drawPolygonButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawLineButton.addEventListener('click', () => {
                    if (this.props.active !== 'drawPolyline') {
                        setActiveTool('drawPolyline');
                        drawingMode('polyline', drawLine);
                        this.removeHighlightsFromButtons('draw-line');
                        drawLineButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawPointButton.addEventListener('click', () => {
                    if (this.props.active !== 'drawPoint') {
                        setActiveTool('drawPoint');
                        drawingMode('point', drawPoint);
                        this.removeHighlightsFromButtons('draw-point');
                        drawPointButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawTextButton.addEventListener('click', () => {
                    if (this.props.active !== 'drawText') {
                        setActiveTool('drawText');
                        drawingMode('point', drawText);
                        this.removeHighlightsFromButtons('draw-text');
                        drawTextButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawEraseButton.addEventListener('click', () => {
                    if (this.props.active !== 'drawErase') {
                        setActiveTool('drawErase');
                        this.removeHighlightsFromButtons('draw-erase');
                        drawEraseButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    } else {
                        setActiveTool('');
                        this.removeHighlightFromButton('draw-erase');
                    }
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
        const { setActiveTool, view } = this.props;

        this.removeHighlightsFromButtons();

        setActiveTool('');

        const hasGraphics = view
            && view.graphics
            && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
        this.setState({ hasGraphics });
    };

    removeDrawings = () => {
        const {
            view, draw, sketchViewModel, setActiveTool,
        } = this.props;
        this.removeHighlight();
        resetMapTools(draw, sketchViewModel, setActiveTool);

        const graphicsToRemove = view.graphics.filter(g => g.type === 'draw-graphic');
        view.graphics.removeMany(graphicsToRemove);
        setActiveTool('');

        const hasGraphics = view
            && view.graphics
            && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
        this.setState({ hasGraphics });
    };

    toggleDrawTools = () => {
        const { isActive, setActiveToolMenu } = this.props;
        if (isActive) {
            setActiveToolMenu('');
        } else {
            setActiveToolMenu('drawTools');
        }
    };

    render() {
        const { hasGraphics } = this.state;
        const { view, isActive } = this.props;

        return (
            <MapDrawView
                hasGraphics={hasGraphics}
                removeDrawings={this.removeDrawings}
                view={view}
                toggleDrawTools={this.toggleDrawTools}
                isActive={isActive}
            />
        );
    }
}

export default MapDraw;
