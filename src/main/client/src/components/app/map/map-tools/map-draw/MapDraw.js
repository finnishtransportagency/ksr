// @flow
import { v4 as uuidv4 } from 'uuid';
// import { loadModules } from 'esri-loader';

import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';

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

    componentDidUpdate(prevProps: Props) {
        const { draw, active } = this.props;
        if (draw !== prevProps.draw && draw.initialized) {
            this.mapDraw();
        } else if (active !== prevProps.active
                    && active === 'drawText'
                    && prevProps.active === '') {
            this.removeHighlightFromButton('draw-text');
        } else if (active !== prevProps.active && active === '') {
            this.removeHighlightsFromButtons();
        }
    }

    mapDraw: (() => void) = () => {
        const {
            view, draw, setActiveTool, showMeasurements,
        } = this.props;

        const drawPolygonButton = document?.getElementById('draw-polygon');
        const drawLineButton = document?.getElementById('draw-line');
        const drawPointButton = document?.getElementById('draw-point');
        const drawTextButton = document?.getElementById('draw-text');
        const drawEraseButton = document?.getElementById('draw-erase');
        const drawToggleMeasurementsButton = document?.getElementById('toggle-measurements');

        const measureArea = (polygon: Object) => {
            const planarArea = geometryEngine.planarArea(
                polygon,
                'square-meters',
            );
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

        const createPolygon = (vertices: any) => new Polygon({
            rings: vertices,
            spatialReference: view.spatialReference,
        });

        const createLine = (vertices: any) => new Polyline({
            paths: vertices,
            spatialReference: view.spatialReference,
        });

        const createPoint = (coordinates: any[]) => new Point({
            x: coordinates[0],
            y: coordinates[1],
            spatialReference: view.spatialReference,
        });

        const createPolygonGraphic = (geometry: any, style: string, complete: boolean): any => new Graphic({
            geometry,
            symbol: {
                type: 'simple-fill',
                style,
                color: [102, 0, 102, 0.5],
                outline: {
                    color: geometry.isSelfIntersecting || geometry.rings.length > 1
                        ? '#CC3300'
                        : '#470047',
                    width: 2,
                },
            },
            type: 'draw-graphic',
            complete,
            id: this.currentGraphicUUID,
        });

        const createPolylineGraphic = (geometry: any, complete: boolean): any => new Graphic({
            geometry,
            symbol: {
                type: 'simple-line',
                color: '#660066',
                width: 2,
            },
            type: 'draw-graphic',
            complete,
            id: this.currentGraphicUUID,
        });

        const createPointGraphic = (geometry: any, complete: boolean): any => new Graphic({
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

        const createTextGraphic = (geometry: any, complete: boolean): any => {
            const { drawText } = this.props;
            if (drawText && drawText.trim().length > 0) {
                return new Graphic({
                    geometry,
                    symbol: {
                        type: 'text',
                        color: '#000',
                        text: drawText,
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

        const createLabelGraphic = (geometry: any, value: string, complete: boolean) => new Graphic({
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
            visible: showMeasurements,
        });

        const drawPolygon = (evt: Object) => {
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
                const simplifiedPolygon = geometryEngine.simplify(polygon);
                if (simplifiedPolygon) {
                    const geometryIsValid = !simplifiedPolygon.isSelfIntersecting
                                && simplifiedPolygon.rings.length === 1;
                    const area = measureArea(simplifiedPolygon);
                    const graphic = createPolygonGraphic(
                        simplifiedPolygon,
                        'solid',
                        evt.type === 'draw-complete' && geometryIsValid,
                    );
                    const graphicLabelMeasure = createLabelGraphic(
                        simplifiedPolygon,
                        area,
                        evt.type === 'draw-complete' && geometryIsValid,
                    );
                    const graphicsToRemove = view.graphics
                        .filter(g => g.id === this.currentGraphicUUID);

                    view.graphics.removeMany(graphicsToRemove);
                    view.graphics.addMany([graphic, graphicLabelMeasure]);

                    if (!geometryIsValid) {
                        evt.preventDefault();
                    } else if (evt.type === 'draw-complete') {
                        this.removeHighlight();
                    }
                }
            }
        };

        const drawLine = (evt: Object) => {
            const { vertices } = evt;
            const line = createLine(vertices);
            const length = measureLength(line);
            const graphic = createPolylineGraphic(line, evt.type === 'draw-complete');
            const graphicLabelMeasure = createLabelGraphic(line, length, evt.type === 'draw-complete');

            const graphicsToRemove = view.graphics
                .filter(g => g.id === this.currentGraphicUUID);
            view.graphics.removeMany(graphicsToRemove);

            view.graphics.addMany([graphic, graphicLabelMeasure]);

            if (evt.type === 'draw-complete') {
                this.removeHighlight();
            }
        };

        const drawPoint = (evt: Object) => {
            const { coordinates } = evt;
            const point = createPoint(coordinates);

            const graphic = createPointGraphic(point, evt.type === 'draw-complete');

            view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));
            view.graphics.add(graphic);

            if (evt.type === 'draw-complete') {
                this.removeHighlight();
            }
        };

        const drawText = (evt: Object) => {
            const { coordinates } = evt;
            const point = createPoint(coordinates);

            const graphic = createTextGraphic(point, evt.type === 'draw-complete');

            view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));

            if (graphic !== null) {
                view.graphics.add(graphic);
            }

            if (evt.type === 'draw-complete') {
                this.removeHighlight();
            }
        };

        const drawingMode = (geometry: any, drawGeometry: any) => {
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
        };

        drawPolygonButton?.addEventListener('click', () => {
            const { active } = this.props;

            if (active === 'drawPolygon') {
                this.resetCurrentTool();
            } else {
                setActiveTool('drawPolygon');
                drawingMode('polygon', drawPolygon);
                this.removeHighlightsFromButtons('draw-polygon');
                drawPolygonButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawLineButton?.addEventListener('click', () => {
            const { active } = this.props;

            if (active === 'drawPolyline') {
                this.resetCurrentTool();
            } else {
                setActiveTool('drawPolyline');
                drawingMode('polyline', drawLine);
                this.removeHighlightsFromButtons('draw-line');
                drawLineButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawPointButton?.addEventListener('click', () => {
            const { active } = this.props;

            if (active === 'drawPoint') {
                this.resetCurrentTool();
            } else {
                setActiveTool('drawPoint');
                drawingMode('point', drawPoint);
                this.removeHighlightsFromButtons('draw-point');
                drawPointButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawTextButton?.addEventListener('click', () => {
            const { active } = this.props;

            if (active === 'drawText') {
                this.resetCurrentTool();
            } else {
                setActiveTool('drawText');
                drawingMode('point', drawText);
                this.removeHighlightsFromButtons('draw-text');
                drawTextButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawEraseButton?.addEventListener('click', () => {
            const { active } = this.props;

            if (active === 'drawErase') {
                this.resetCurrentTool();
            } else {
                this.resetCurrentTool();
                setActiveTool('drawErase');
                this.removeHighlightsFromButtons('draw-erase');
                drawEraseButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawToggleMeasurementsButton?.addEventListener('click', () => {
            this.toggleMeasurements();
        });
    };

    removeHighlightFromButton: ((id: ?string) => void) = (id: ?string) => {
        if (id) {
            const button = document?.getElementById(id);
            if (button) {
                button.style.backgroundColor = styles.colorMain;
            }
        }
    };

    removeHighlightsFromButtons: ((exceptButton: ?string) => void) = (exceptButton: ?string) => {
        const { view } = this.props;
        ['draw-polygon', 'draw-line', 'draw-point', 'draw-text', 'draw-erase']
            .filter(i => i !== exceptButton)
            .forEach(b => this.removeHighlightFromButton(b));
        removeTemporaryDrawings(view);
    };

    removeHighlight: (() => void) = () => {
        const { setActiveTool, view, setHasGraphics } = this.props;

        this.removeHighlightsFromButtons();

        setActiveTool('');

        const hasGraphics = view
            && view.graphics
            && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
        setHasGraphics(hasGraphics);
    };

    removeDrawings: any | (() => void) | (() => void) = () => {
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

    toggleDrawTools: any | (() => void) | (() => void) = () => {
        const { isActive, setActiveToolMenu } = this.props;
        if (isActive) {
            setActiveToolMenu('');
        } else {
            setActiveToolMenu('drawTools');
        }
    };

    resetCurrentTool: (() => void) = () => {
        const { draw, setActiveTool } = this.props;

        setActiveTool('');
        draw.reset();
        this.removeHighlightsFromButtons();
    };

    toggleMeasurements: any | (() => void) | (() => void) = () => {
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

    render(): React$Element<(_0: Props & { removeDrawings: any, activeTool: any, toggleDrawTools: any }) => any> {
        const {
            view,
            isActive,
            hasGraphics,
            showMeasurements,
            active,
        } = this.props;

        return (
            <MapDrawView
                hasGraphics={hasGraphics}
                removeDrawings={this.removeDrawings}
                view={view}
                toggleDrawTools={this.toggleDrawTools}
                isActive={isActive}
                showMeasurements={showMeasurements}
                activeTool={active}
            />
        );
    }
}

export default MapDraw;
