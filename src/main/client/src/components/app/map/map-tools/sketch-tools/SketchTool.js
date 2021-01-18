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
import { nestedVal } from '../../../../../utils/nestedValue';

type State = {
    editSketchIcon: string,
    validGeometry: boolean,
    canRedo: boolean,
    canUndo: boolean,
};

const initialState = {
    editSketchIcon: 'polygon',
    validGeometry: true,
    canRedo: false,
    canUndo: false,
};

type Props = {
    view: Object,
    draw: Object,
    sketchViewModel: Object,
    selectFeatures: Function,
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
    view: Object,
    editedLayers: Object[],
    featureType: string,
    addressField: string,
    hasTableEdited: boolean,
    sketchSaveData: Function,
};

class SketchTool extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };

        this.drawNewFeatureButton = createRef();
        this.drawNewAreaButton = createRef();
        this.drawRectangleButton = createRef();
        this.drawPolygonButton = createRef();
        this.drawCircleButton = createRef();
        this.toggleSelectToolsButton = createRef();
        this.removeSelection = this.removeSelection.bind(this);
        this.removeSketch = this.removeSketch.bind(this);
        this.toggleSelectTools = this.toggleSelectTools.bind(this);
    }

    componentDidUpdate(prevProps: Props) {
        const {
            sketchViewModel, activeAdminTool, draw, setActiveTool, geometryType,
        } = this.props;
        if (sketchViewModel !== prevProps.sketchViewModel
            && sketchViewModel.initialized) {
            this.sketchTool();
        }

        if (prevProps.activeAdminTool !== activeAdminTool) {
            switch (geometryType) {
                case 'esriGeometryPolygon':
                    this.updateState('polygon');
                    break;
                case 'esriGeometryMultipoint':
                    this.updateState('handle-horizontal');
                    break;
                case 'esriGeometryPoint':
                    this.updateState('blank-map-pin');
                    break;
                case 'esriGeometryPolyline':
                    this.updateState('polyline');
                    break;
                case 'esriGeometryEnvelope':
                    this.updateState('checkbox-unchecked');
                    break;
                case 'esriGeometryCircularArc':
                    this.updateState('radio-unchecked');
                    break;
                default:
                    this.updateState('polygon');
            }
            // Remove temp sketch
            if (draw.initialized) {
                this.removeSketch();
                resetMapTools(draw, sketchViewModel, setActiveTool);
            }
        }
    }

    sketchTool = () => {
        esriLoader
            .loadModules([
                'esri/geometry/geometryEngine',
                'esri/geometry/Polygon',
                'esri/geometry/Polyline',
                'esri/Graphic',
                'esri/geometry/Point',
            ])
            .then(([geometryEngine, Polygon, Polyline, Graphic, Point]) => {
                const {
                    view,
                    draw,
                    sketchViewModel,
                    setActiveTool,
                    tempGraphicsLayer,
                    setActiveToolMenu,
                    setTempGraphicsLayer,
                } = this.props;

                const drawNewFeatureButton = this.drawNewFeatureButton.current;
                const drawNewAreaButton = this.drawNewAreaButton.current;
                const drawRectangleButton = this.drawRectangleButton.current;
                const drawPolygonButton = this.drawPolygonButton.current;
                const drawCircleButton = this.drawCircleButton.current;

                drawNewFeatureButton.addEventListener('click', (event) => {
                    const { active, geometryType } = this.props;
                    // user cannot draw more than 1 sketch
                    if (drawNewFeatureButton.classList.contains('disabled')) {
                        event.preventDefault();
                        return;
                    }
                    if (active === 'sketchActiveAdmin') {
                        setActiveToolMenu('');
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else if (!active) {
                        view.popup.close();
                        setActiveToolMenu('sketchActiveAdmin');
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchActiveAdmin');
                        const convertedGeometryType = convertEsriGeometryType(geometryType);
                        sketchViewModel.create(convertedGeometryType);
                        drawNewFeatureButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawNewAreaButton.addEventListener('click', () => {
                    const { geometryType } = this.props;
                    setActiveTool('sketchActiveAdmin');
                    const convertedGeometryType = convertEsriGeometryType(geometryType);
                    sketchViewModel.create(convertedGeometryType);
                    drawNewAreaButton.style.backgroundColor = styles.colorMainDark;
                });

                drawRectangleButton.addEventListener('click', () => {
                    const { active } = this.props;
                    if (active === 'sketchRectangle') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchRectangle');
                        sketchViewModel.create('rectangle');
                        drawRectangleButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawPolygonButton.addEventListener('click', () => {
                    const { active } = this.props;
                    if (active === 'sketchPolygon') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchPolygon');
                        sketchViewModel.create('polygon');
                        drawPolygonButton.style.backgroundColor = styles.colorMainDark;
                    }
                });

                drawCircleButton.addEventListener('click', () => {
                    const { active } = this.props;
                    if (active === 'sketchCircle') {
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

                const createLabelGraphic = (geometry, value) => new Graphic({
                    geometry,
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
                    id: 'area',
                    visible: true,
                });

                const measurement = (polygon: Object) => {
                    const planarArea = Math.abs(geometryEngine.planarArea(
                        polygon,
                        'square-meters',
                    ));
                    let measure = '0';
                    if (planarArea >= 10000) {
                        measure = `${parseFloat((planarArea / 10000).toFixed(2))} ha`;
                    } else if (planarArea > 0 && planarArea < 10000) {
                        measure = `${parseFloat(planarArea.toFixed(2))} m\xB2`;
                    } else if (planarArea === 0) {
                        const line = new Polyline({
                            paths: polygon.rings,
                            spatialReference: view.spatialReference,
                        });
                        const planarLength = (geometryEngine.planarLength(line, 'meters')) / 2;
                        measure = `${parseFloat(planarLength.toFixed(2))} m`;
                    }
                    return measure;
                };

                const createPolygon = vertices => new Polygon({
                    rings: vertices,
                    spatialReference: view.spatialReference,
                });

                const addGraphic = (graphic) => {
                    if (graphic.geometry.type === 'polygon' && (graphic.geometry.isSelfIntersecting
                        || graphic.geometry.rings.length > 1)) {
                        const clonedSymbol = graphic.symbol.clone();
                        clonedSymbol.outline = createSketchOutlineGraphic(false);
                        graphic.symbol = clonedSymbol;
                    }
                    graphic.type = 'sketch-graphic';
                    setTempGraphicsLayer(tempGraphicsLayer);
                };

                const updatePolygonLabels = () => {
                    // Remove existing labels
                    const labelGraphics = tempGraphicsLayer.graphics.items
                        .filter(graphic => graphic.type === 'draw-measure-label');
                    labelGraphics.forEach(label => tempGraphicsLayer.remove(label));

                    const sketchGraphic = tempGraphicsLayer.graphics.items.find(a => a.type === 'sketch-graphic');
                    if (sketchGraphic && sketchGraphic.geometry) {
                        const { rings, spatialReference, type } = sketchGraphic.geometry;

                        if (type === 'polygon') {
                            const areaLabels = rings.map((ring) => {
                                const labelPoint = new Point({
                                    x: ring.map(r => r[0])
                                        .reduce((a, c) => c + a, 0) / ring.length,
                                    y: ring.map(r => r[1])
                                        .reduce((a, c) => c + a, 0) / ring.length,
                                    spatialReference,
                                });

                                return createLabelGraphic(
                                    labelPoint,
                                    measurement(createPolygon(ring)),
                                );
                            });

                            areaLabels.forEach((areaLabel) => {
                                tempGraphicsLayer.add(areaLabel);
                            });
                        }
                    }
                };

                const selectFeaturesFromDraw = async (event) => {
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
                            if (event.graphic !== null
                                && event.graphic.geometry.rings[0].length > 2) {
                                const { geometry } = event.graphic;
                                const { rings } = geometry;
                                const polygon = createPolygon(rings);
                                const measure = measurement(polygon);
                                const areaLabel = createLabelGraphic(geometry, measure);

                                updatePolygonLabels();
                                tempGraphicsLayer.add(areaLabel);
                            }
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

                            // Combine multiple polygons into multipolygon
                            if (event.tool === 'polygon') {
                                const sketchGraphicItems = tempGraphicsLayer.graphics.items
                                    .filter(item => item.type === 'sketch-graphic');
                                const combinedRings = sketchGraphicItems
                                    .filter(item => item.type === 'sketch-graphic').flatMap(item => item.geometry.rings);
                                const firstSketchGraphic = tempGraphicsLayer.graphics.items
                                    .find(item => item.type === 'sketch-graphic');
                                firstSketchGraphic.geometry.rings = combinedRings;

                                // Remove excessive polygons that were used for combined rings
                                sketchGraphicItems.forEach((sketchItem) => {
                                    if (sketchItem.uid !== firstSketchGraphic.uid) {
                                        tempGraphicsLayer.remove(sketchItem);
                                    }
                                });

                                sketchViewModel.update(firstSketchGraphic);
                            }
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
                            // Graphic is added to the layer by default so when selecting features
                            // the added graphic has to removed manually.
                            tempGraphicsLayer.remove(event.graphic);

                            await queryFeatures(
                                geometry,
                                view,
                                selectFeatures,
                            );
                        }
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    }
                    this.setState({
                        validGeometry: this.validGeometry(),
                        canRedo: event.target.canRedo(),
                        canUndo: event.target.canUndo(),
                    });
                };

                const onUpdate = (event) => {
                    updatePolygonLabels();

                    if (event.graphics[0].geometry.isSelfIntersecting) {
                        const clonedSymbol = event.graphics[0].symbol.clone();
                        clonedSymbol.outline = createSketchOutlineGraphic(false);
                        event.graphics[0].symbol = clonedSymbol;
                    } else {
                        const updateModeActive = event.type === 'redo'
                            || event.type === 'undo'
                            || (event.type === 'update' && event.state !== 'cancel'
                                && event.state !== 'complete');
                        const clonedSymbol = event.graphics[0].symbol.clone();
                        clonedSymbol.outline = createSketchOutlineGraphic(true, updateModeActive);
                        event.graphics[0].symbol = clonedSymbol;
                    }
                    this.setState({
                        validGeometry: this.validGeometry(),
                        canRedo: event.target.canRedo(),
                        canUndo: event.target.canUndo(),
                    });
                };

                sketchViewModel.on('create', selectFeaturesFromDraw);
                sketchViewModel.on(['redo', 'undo', 'update'], onUpdate);
            });
    };

    updateState = (editSketchIcon: string) => {
        this.setState({ editSketchIcon });
    };

    removeSelection = () => {
        const {
            sketchSaveData,
            view,
            data,
            editedLayers,
            featureType,
            addressField,
            hasTableEdited,
        } = this.props;

        const layer = editedLayers.filter(l => l.id === data[0]._layerId);
        sketchSaveData(view, layer, featureType, addressField, hasTableEdited);
        view.popup.close();
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
        const {
            setActiveFeatureMode,
            setTempGraphicsLayer,
            sketchViewModel,
            tempGraphicsLayer,
        } = this.props;

        setActiveFeatureMode('create');
        const layer = tempGraphicsLayer;
        layer.graphics = undefined;
        setTempGraphicsLayer(layer);
        sketchViewModel.cancel();
    };

    showAdminView = (): boolean => {
        const { activeAdminTool, layerList } = this.props;

        if (activeAdminTool === '') {
            return false;
        }
        const layer = layerList.find(l => l.id === activeAdminTool);
        return layer ? layer.type !== 'agfl' && !nestedVal(layer, ['propertyIdField']) && layer.layerPermission.createLayer : false;
    };

    validGeometry = () => {
        const { tempGraphicsLayer } = this.props;

        if (tempGraphicsLayer) {
            const currentGeomItems = tempGraphicsLayer.graphics.items
                .filter(item => item.type === 'sketch-graphic');

            return !currentGeomItems.some(item => item.geometry.isSelfIntersecting);
        }

        return false;
    };

    redo = () => {
        const { sketchViewModel } = this.props;
        sketchViewModel.redo();
    };

    undo = () => {
        const { sketchViewModel } = this.props;
        sketchViewModel.undo();
    };

    // Assign constructor ref flowtypes
    drawNewFeatureButton: any;

    drawNewAreaButton: any;

    drawRectangleButton: any;

    drawPolygonButton: any;

    drawCircleButton: any;

    toggleSelectToolsButton: any;

    render() {
        const {
            data, view, tempGraphicsLayer, setActiveModal, isOpen, editModeActive, active,
        } = this.props;
        const {
            editSketchIcon, validGeometry, canRedo, canUndo,
        } = this.state;

        const hasSelectedFeatures = data.length > 0;
        const hasAdminGraphics = tempGraphicsLayer
            && tempGraphicsLayer.graphics
            && tempGraphicsLayer.graphics.filter(g => g.type === 'sketch-graphic').length > 0;

        const showNewAreaButton = hasAdminGraphics && editSketchIcon === 'polygon';

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
                    editSketchIcon={editSketchIcon}
                    removeSketch={this.removeSketch}
                    showAdminView={this.showAdminView()}
                    drawNewFeatureButtonRef={this.drawNewFeatureButton}
                    drawNewAreaButtonRef={this.drawNewAreaButton}
                    hasAdminGraphics={hasAdminGraphics}
                    setActiveModal={setActiveModal}
                    editModeActive={editModeActive}
                    validGeometry={validGeometry}
                    activeTool={active}
                    showNewAreaButton={showNewAreaButton}
                    redo={this.redo}
                    undo={this.undo}
                    canRedo={canRedo}
                    canUndo={canUndo}
                />
            </Fragment>
        );
    }
}

export default SketchTool;
