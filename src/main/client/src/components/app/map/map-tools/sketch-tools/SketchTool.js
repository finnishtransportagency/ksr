// @flow
import esriLoader from 'esri-loader';
import React, { Component, createRef, Fragment } from 'react';
import { resetMapTools } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import SketchToolView from './SketchToolView';
import SketchActiveAdminView from './sketch-active-admin/SketchActiveAdminView';

type State = {
    isOpen: boolean,
    editSketchIcon: string,
};

const initialState = {
    isOpen: false,
    editSketchIcon: 'polygon',
};

type Props = {
    view: Object,
    draw: Object,
    sketchViewModel: Object,
    selectFeatures: Function,
    deSelectSelected: Function,
    active: string,
    setActiveTool: Function,
    tempGraphicsLayer: Object,
    data: Array<Object>,
    activeAdminTool: string,
    setEditMode: (editMode: string) => void,
    setTempGrapLayer: Function,
    geometryType: string,
    setActiveModal: (modal: string) => void,
    activeModal: string,
};

class SketchTool extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };

        this.drawNewFeatureButton = createRef();
        this.drawRectangleButton = createRef();
        this.drawPolygonButton = createRef();
        this.drawCircleButton = createRef();
        this.toggleSelectToolsButton = createRef();
        this.removeSelection = this.removeSelection.bind(this);
        this.removeSketch = this.removeSketch.bind(this);
        this.toggleSelectTools = this.toggleSelectTools.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        const { sketchViewModel, activeAdminTool } = this.props;

        if (sketchViewModel !== newProps.sketchViewModel && newProps.sketchViewModel.initialized) {
            this.sketchTool();
        }

        if (activeAdminTool !== newProps.activeAdminTool) {
            switch (newProps.geometryType) {
                case 'esriGeometryPolygon':
                    this.setState({ editSketchIcon: 'polygon' });
                    break;
                case 'esriGeometryMultipoint':
                    this.setState({ editSketchIcon: 'handle-horizontal' });
                    break;
                case 'esriGeometryPoint':
                    this.setState({ editSketchIcon: 'blank-map-pin' });
                    break;
                case 'esriGeometryPolyline':
                    this.setState({ editSketchIcon: 'polyline' });
                    break;
                case 'esriGeometryEnvelope':
                    this.setState({ editSketchIcon: 'checkbox-unchecked' });
                    break;
                case 'esriGeometryCircularArc':
                    this.setState({ editSketchIcon: 'radio-unchecked' });
                    break;
                default:
                    this.setState({ editSketchIcon: 'polygon' });
            }
            // Remove temp sketch
            if (newProps.draw.initialized) {
                this.removeSketch();
                resetMapTools(newProps.draw, sketchViewModel, this.props.setActiveTool);
            }
        }
    }

    sketchTool = () => {
        esriLoader
            .loadModules(['esri/Graphic'])
            .then(([Graphic]) => {
                const {
                    view, draw, sketchViewModel, setActiveTool, tempGraphicsLayer,
                } = this.props;

                const drawNewFeatureButton = this.drawNewFeatureButton.current;
                const drawRectangleButton = this.drawRectangleButton.current;
                const drawPolygonButton = this.drawPolygonButton.current;
                const drawCircleButton = this.drawCircleButton.current;

                drawNewFeatureButton.addEventListener('click', (event) => {
                    // user cannot draw more than 1 sketch
                    if (drawNewFeatureButton.classList.contains('draw-create-new-feature-disabled')) {
                        event.preventDefault();
                        return;
                    }
                    if (this.props.active === 'sketchActiveAdmin') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchActiveAdmin');
                        switch (this.props.geometryType) {
                            case 'esriGeometryPolygon':
                                sketchViewModel.create('polygon');
                                break;
                            case 'esriGeometryMultipoint':
                                sketchViewModel.create('multipoint');
                                break;
                            case 'esriGeometryPoint':
                                sketchViewModel.create('point');
                                break;
                            case 'esriGeometryPolyline':
                                sketchViewModel.create('polyline');
                                break;
                            case 'esriGeometryEnvelope':
                                sketchViewModel.create('rectangle');
                                break;
                            case 'esriGeometryCircularArc':
                                sketchViewModel.create('circle');
                                break;
                            default:
                                sketchViewModel.create('polygon');
                        }
                        drawNewFeatureButton.style.backgroundColor =
                            styles.colorBackgroundDarkBlue;
                    }
                });

                drawRectangleButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchRectangle') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchRectangle');
                        sketchViewModel.create('rectangle');
                        drawRectangleButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawPolygonButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchPolygon') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchPolygon');
                        sketchViewModel.create('polygon');
                        drawPolygonButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawCircleButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchCircle') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchCircle');
                        sketchViewModel.create('circle');
                        drawCircleButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                const addGraphic = (geometry) => {
                    // Create a new graphic and set its geometry to tempGraphicsLayer
                    // `create-complete` event geometry.
                    const graphic = new Graphic({
                        geometry,
                        symbol: sketchViewModel.graphic.symbol,
                    });
                    tempGraphicsLayer.add(graphic);
                    this.props.setTempGrapLayer(tempGraphicsLayer);
                };

                const updateGraphic = (event) => {
                    // event.graphic is the graphic that user clicked on and its geometry
                    // has not been changed. Update its geometry and add it to the layer
                    event.graphic.geometry = event.geometry;
                    tempGraphicsLayer.add(event.graphic);
                    this.props.setEditMode('finish');
                };

                const selectFeaturesFromDraw = (evt) => {
                    const { geometry } = evt;
                    const { active, activeAdminTool } = this.props;

                    // Skip finding layers if Administrator editing is in use
                    if (active === 'sketchActiveAdmin') {
                        addGraphic(geometry);
                    } else {
                        const query = {
                            geometry,
                            outFields: ['*'],
                        };
                        const queries = [];
                        view.map.layers.forEach((layer) => {
                            if (layer.queryFeatures) {
                                if (layer.visible &&
                                    !layer.definitionExpression &&
                                    view.scale < layer.minScale &&
                                    view.scale > layer.maxScale
                                ) {
                                    if (activeAdminTool && activeAdminTool === layer.id) {
                                        queries.push(layer.queryFeatures(query).then(results => ({
                                            id: layer.id,
                                            title: layer.title,
                                            objectIdFieldName: layer.objectIdField,
                                            features: results.features,
                                            fields: layer.fields,
                                        })));
                                    } else if (!activeAdminTool) {
                                        queries.push(layer.queryFeatures(query).then(results => ({
                                            id: layer.id,
                                            title: layer.title,
                                            objectIdFieldName: layer.objectIdField,
                                            features: results.features,
                                            fields: layer.fields,
                                        })));
                                    }
                                }
                            }
                        });
                        Promise.all(queries).then(layers => this.props.selectFeatures({ layers }));
                    }
                    resetMapTools(draw, sketchViewModel, setActiveTool);
                    setActiveTool('');
                };
                sketchViewModel.on('create-complete', selectFeaturesFromDraw);
                sketchViewModel.on('update-complete', updateGraphic);
                sketchViewModel.on('update-cancel', updateGraphic);
            });
    };

    removeSelection = () => {
        this.props.deSelectSelected();
    };

    toggleSelectTools = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    removeSketch = () => {
        const layer = this.props.tempGraphicsLayer;
        layer.graphics = undefined;
        this.props.setTempGrapLayer(layer);
    };

    // Assign constructor ref flowtypes
    drawNewFeatureButton: any;
    drawRectangleButton: any;
    drawPolygonButton: any;
    drawCircleButton: any;
    toggleSelectToolsButton: any;

    render() {
        const {
            data, view, activeAdminTool, tempGraphicsLayer, activeModal, setActiveModal,
        } = this.props;
        return (
            <Fragment>
                <SketchToolView
                    removeSelection={this.removeSelection}
                    drawRectangleButtonRef={this.drawRectangleButton}
                    drawPolygonButtonRef={this.drawPolygonButton}
                    drawCircleButtonRef={this.drawCircleButton}
                    toggleSelectToolsButtonRef={this.toggleSelectToolsButton}
                    toggleTools={this.toggleSelectTools}
                    isOpen={this.state.isOpen}
                    data={data}
                    view={view}
                />
                <SketchActiveAdminView
                    editSketchIcon={this.state.editSketchIcon}
                    removeSketch={this.removeSketch}
                    activeAdminTool={activeAdminTool}
                    drawNewFeatureButtonRef={this.drawNewFeatureButton}
                    tempGraphicsLayer={tempGraphicsLayer}
                    setActiveModal={setActiveModal}
                    activeModal={activeModal}
                />

            </Fragment>
        );
    }
}

export default SketchTool;
