// @flow
import uuidv4 from 'uuid/v4';
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { resetMapTools } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import MapDrawView from './MapDrawView';

type State = {
    hasGraphics: boolean,
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
    hasGraphics: false,
    drawTools: false,
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
        }
    }

    mapDraw = () => {
        esriLoader
            .loadModules([
                'esri/geometry/Polygon',
                'esri/geometry/Polyline',
                'esri/Graphic',
            ])
            .then(([Polygon, Polyline, Graphic]) => {
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
                        type: 'draw-graphic',
                        id: this.currentGraphicUUID,
                    });

                const drawPolygon = (evt) => {
                    const { vertices } = evt;
                    const polygon = createPolygon(vertices);

                    const graphic = createGraphic(polygon, 'solid');
                    view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));
                    view.graphics.add(graphic);
                };

                const drawLine = (evt) => {
                    const { vertices } = evt;
                    const line = createLine(vertices);

                    const graphic = createGraphic(line, 'none');

                    view.graphics.forEach(g => g.id === this.currentGraphicUUID
                        && view.graphics.remove(g));
                    view.graphics.add(graphic);
                };

                const drawingMode = (geometry, drawGeometry) => {
                    const action = draw.create(geometry);
                    this.currentGraphicUUID = uuidv4();

                    view.focus();

                    action.on(
                        ['vertex-add', 'cursor-update', 'vertex-remove', 'draw-complete'],
                        drawGeometry,
                    );

                    action.on('draw-complete', this.removeHighlight);
                };

                drawPolygonButton.addEventListener('click', () => {
                    if (this.props.active !== 'drawPolygon') {
                        setActiveTool('drawPolygon');
                        drawingMode('polygon', drawPolygon);
                        drawPolygonButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawLineButton.addEventListener('click', () => {
                    if (this.props.active !== 'drawPolyline') {
                        setActiveTool('drawPolyline');
                        drawingMode('polyline', drawLine);
                        drawLineButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });
            });
    };

    removeHighlight = () => {
        const { setActiveTool, view } = this.props;
        const drawPolygonButton = (document.getElementById: Function)('draw-polygon');
        const drawLineButton = (document.getElementById: Function)('draw-line');
        drawPolygonButton.style.backgroundColor = styles.colorMain;
        drawLineButton.style.backgroundColor = styles.colorMain;
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
        const { drawTools } = this.state;

        this.setState({ drawTools: !drawTools });
    };

    render() {
        const { drawTools, hasGraphics } = this.state;
        const { view } = this.props;

        return (
            <MapDrawView
                hasGraphics={hasGraphics}
                removeDrawings={this.removeDrawings}
                view={view}
                toggleDrawTools={this.toggleDrawTools}
                drawTools={drawTools}
            />
        );
    }
}

export default MapDraw;
