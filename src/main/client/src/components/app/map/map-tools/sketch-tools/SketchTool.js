// @flow
import esriLoader from 'esri-loader';
import React, { Component, createRef, Fragment } from 'react';
import { toast } from 'react-toastify';
import strings from '../../../../../translations';
import { resetMapTools } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import SketchToolView from './SketchToolView';
import SketchActiveAdminView from './sketch-active-admin/SketchActiveAdminView';
import { queryFeatures } from '../../../../../utils/queryFeatures';
import { convertEsriGeometryType } from '../../../../../utils/type';

type State = {
    editSketchIcon: string,
    validGeometry: boolean,
};

const initialState = {
    editSketchIcon: 'polygon',
    validGeometry: true,
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
    setTempGraphicsLayer: Function,
    geometryType: string,
    setActiveModal: (editModeActive: boolean) => void,
    isOpen: boolean,
    setActiveToolMenu: Function,
    layerList: Object[],
    propertyAreaSearch: boolean,
    setPropertyInfo: (
        queryParameter: Object | string,
        view: Object,
        graphicId: string,
        authorities: Object[],
    ) => void,
    authorities: Object[],
    editModeActive: boolean,
    setActiveFeatureMode: (activeFeatureMode: string) => void,
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
            .loadModules(['esri/geometry/geometryEngine'])
            .then(([geometryEngine]) => {
                const {
                    view,
                    draw,
                    sketchViewModel,
                    setActiveTool,
                    tempGraphicsLayer,
                    setActiveToolMenu,
                    editModeActive,
                } = this.props;

                const drawNewFeatureButton = this.drawNewFeatureButton.current;
                const drawRectangleButton = this.drawRectangleButton.current;
                const drawPolygonButton = this.drawPolygonButton.current;
                const drawCircleButton = this.drawCircleButton.current;

                drawNewFeatureButton.addEventListener('click', (event) => {
                    // user cannot draw more than 1 sketch
                    if (drawNewFeatureButton.classList.contains('disabled')) {
                        event.preventDefault();
                        return;
                    }
                    if (this.props.active === 'sketchActiveAdmin') {
                        setActiveToolMenu('');
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else if (!this.props.active) {
                        view.popup.close();
                        setActiveToolMenu('sketchActiveAdmin');
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchActiveAdmin');
                        const geometryType = convertEsriGeometryType(this.props.geometryType);
                        sketchViewModel.create(geometryType);
                        drawNewFeatureButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawRectangleButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchRectangle') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchRectangle');
                        sketchViewModel.create('rectangle');
                        drawRectangleButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawPolygonButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchPolygon') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchPolygon');
                        sketchViewModel.create('polygon');
                        drawPolygonButton.style.backgroundColor = styles.colorMainDark;
                        this.setState({ validGeometry: true });
                    }
                });

                drawCircleButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchCircle') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchCircle');
                        sketchViewModel.create('circle');
                        drawCircleButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                const createSketchLineGraphic = (isValid: boolean) => (
                    {
                        type: 'simple-line',
                        style: 'dash',
                        color: isValid ? 'rgba(12, 207, 255, 1)' : 'rgba(204, 51, 0, 1)',
                        width: 2,
                    }
                );

                const createSketchOutlineGraphic = (isValid: boolean, updateActive?: boolean) => {
                    const color = updateActive ? 'rgba(12, 207, 255, 1)' : 'rgba(0, 0, 0, 1)';
                    return {
                        type: 'simple-line',
                        style: 'solid',
                        color: isValid ? color : 'rgba(204, 51, 0, 1)',
                        width: 2,
                    };
                };

                const addGraphic = (graphic) => {
                    if (graphic.geometry.type === 'polygon' && (graphic.geometry.isSelfIntersecting
                        || graphic.geometry.rings.length > 1)) {
                        const clonedSymbol = graphic.symbol.clone();
                        clonedSymbol.outline = createSketchOutlineGraphic(false);
                        graphic.symbol = clonedSymbol;

                        this.setState({ validGeometry: false });
                    }
                    graphic.type = 'sketch-graphic';
                    this.props.setTempGraphicsLayer(tempGraphicsLayer);
                };

                const selectFeaturesFromDraw = (event) => {
                    const { active } = this.props;
                    if (
                        event.state === 'active'
                        && event.tool === 'polygon'
                        && active === 'sketchActiveAdmin'
                    ) {
                        if (event.graphic.geometry.isSelfIntersecting
                            || event.graphic.geometry.rings.length > 1) {
                            event.target._activeLineGraphic.symbol = createSketchLineGraphic(false);
                            this.setState({ validGeometry: false });
                        } else {
                            event.target._activeLineGraphic.symbol = createSketchLineGraphic(true);
                            this.setState({ validGeometry: true });
                        }
                    } else if (event.state === 'complete') {
                        const { graphic } = event;
                        const { geometry } = event.graphic;
                        const {
                            selectFeatures,
                            propertyAreaSearch,
                            setPropertyInfo,
                            authorities,
                        } = this.props;

                        // Skip finding layers if Administrator editing is in use
                        if (active === 'sketchActiveAdmin') {
                            addGraphic(graphic);
                        } else {
                            if (propertyAreaSearch) {
                                const polygon = geometry.rings[0].map(point => `${point[0]} ${point[1]}`).join(' ');
                                const area = geometryEngine.planarArea(
                                    geometry,
                                    'square-kilometers',
                                );

                                if (area > 0.25) {
                                    toast.error(strings.searchProperty.errorToast.searchAreaLimit);
                                } else {
                                    setPropertyInfo({ polygon }, view, 'propertyArea', authorities);
                                }
                            }

                            queryFeatures(
                                geometry,
                                view,
                                selectFeatures,
                            );
                            // Graphic is added to the layer by default so when selecting features
                            // the added graphic has to removed manually.
                            tempGraphicsLayer.remove(event.graphic);
                        }
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('');
                    }
                };

                const onUpdate = (event) => {
                    if (event.graphics[0].geometry.isSelfIntersecting
                        || (!editModeActive && event.graphics[0].geometry.rings.length > 1)) {
                        const clonedSymbol = event.graphics[0].symbol.clone();
                        clonedSymbol.outline = createSketchOutlineGraphic(false);
                        event.graphics[0].symbol = clonedSymbol;

                        this.setState({ validGeometry: false });
                    } else {
                        const updateModeActive = event.type === 'redo'
                            || event.type === 'undo'
                            || (event.type === 'update' && event.state !== 'cancel'
                                && event.state !== 'complete');
                        const clonedSymbol = event.graphics[0].symbol.clone();
                        clonedSymbol.outline = createSketchOutlineGraphic(true, updateModeActive);
                        event.graphics[0].symbol = clonedSymbol;

                        this.setState({ validGeometry: true });
                    }
                };

                sketchViewModel.on('create', selectFeaturesFromDraw);
                sketchViewModel.on(['redo', 'undo', 'update'], onUpdate);
            });
    };

    removeSelection = () => {
        this.props.deSelectSelected();
        this.props.view.popup.close();
    };

    toggleSelectTools = () => {
        const { isOpen, setActiveToolMenu } = this.props;
        if (isOpen) {
            setActiveToolMenu('');
        } else {
            setActiveToolMenu('sketchTools');
        }
    };

    removeSketch = () => {
        const { setActiveFeatureMode } = this.props;
        setActiveFeatureMode('create');
        const layer = this.props.tempGraphicsLayer;
        layer.graphics = undefined;
        this.props.setTempGraphicsLayer(layer);
        this.props.sketchViewModel.cancel();
    };

    showAdminView = (): boolean => {
        if (this.props.activeAdminTool === '') {
            return false;
        }
        const layer = this.props.layerList.find(l => l.id === this.props.activeAdminTool);
        return layer ? layer.type !== 'agfl' && layer.layerPermission.createLayer : false;
    };

    // Assign constructor ref flowtypes
    drawNewFeatureButton: any;
    drawRectangleButton: any;
    drawPolygonButton: any;
    drawCircleButton: any;
    toggleSelectToolsButton: any;

    render() {
        const {
            data, view, tempGraphicsLayer, setActiveModal, isOpen, editModeActive, active,
        } = this.props;
        const { validGeometry } = this.state;

        const hasSelectedFeatures = data.filter(f => f._source !== 'search').length > 0;

        const hasAdminGraphics = tempGraphicsLayer
            && tempGraphicsLayer.graphics
            && tempGraphicsLayer.graphics.filter(g => g.type === 'sketch-graphic').length > 0;

        return (
            <Fragment>
                <SketchToolView
                    removeSelection={this.removeSelection}
                    drawRectangleButtonRef={this.drawRectangleButton}
                    drawPolygonButtonRef={this.drawPolygonButton}
                    drawCircleButtonRef={this.drawCircleButton}
                    toggleSelectToolsButtonRef={this.toggleSelectToolsButton}
                    toggleTools={this.toggleSelectTools}
                    hasSelectedFeatures={hasSelectedFeatures}
                    isOpen={isOpen}
                    view={view}
                    activeTool={active}
                />
                <SketchActiveAdminView
                    editSketchIcon={this.state.editSketchIcon}
                    removeSketch={this.removeSketch}
                    showAdminView={this.showAdminView()}
                    drawNewFeatureButtonRef={this.drawNewFeatureButton}
                    hasAdminGraphics={hasAdminGraphics}
                    setActiveModal={setActiveModal}
                    editModeActive={editModeActive}
                    validGeometry={validGeometry}
                    activeTool={active}
                />
            </Fragment>
        );
    }
}

export default SketchTool;
