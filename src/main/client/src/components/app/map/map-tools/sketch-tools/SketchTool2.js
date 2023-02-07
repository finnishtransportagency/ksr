import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';

import strings from '../../../../../translations';
import { resetMapTools } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import SketchToolView from './SketchToolView';
import SketchActiveAdminView from './sketch-active-admin/SketchActiveAdminView';
import { queryFeatures } from '../../../../../utils/queryFeatures';
import { convertEsriGeometryType } from '../../../../../utils/type';
import { nestedVal } from '../../../../../utils/nestedValue';
import save from '../../../../../utils/saveFeatureData';

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
    movingGeometry: undefined,
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
    setTempGraphicsLayer: (graphics: Object) => void,
    geometryType: string,
    setActiveModal: (editModeActive: boolean) => void,
    isOpen: boolean,
    setActiveToolMenu: (something: any) => void,
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
    resetFeatureNoGeometry: Function,
};

const sketchSymbol = {
    type: 'simple-fill',
    color: [0, 0, 0, 0.2],
    outline: {
        color: [0, 0, 0],
        width: 1,
    },
};

export default function SketchTool2({ ...props }: Props) {
    const drawNewFeatureButtonRef = useRef();
    const drawNewAreaButtonRef = useRef();
    const drawRectangleButtonRef = useRef();
    const drawPolygonButtonRef = useRef();
    const drawCircleButtonRef = useRef();
    const toggleSelectToolsButton = useRef();
    const [sketchViewModel, setSketchViewModel] = useState(props.sketchViewModel);
    const [localTempGraphicsLayer, _setLocalTempGraphicsLayer] = useState(props.tempGraphicsLayer);
    const [geometryType, _setGeometryType] = useState(props.geometryType);
    const [active, _setActive] = useState(props.active);
    const [state, setState] = useState({ ...initialState });
    const { view } = props;

    const activeStateRef = useRef(active);
    const ltgRef = useRef(localTempGraphicsLayer);
    const geometryTypeRef = useRef(geometryType);
    const setActive = (data) => {
        activeStateRef.current = data;
        _setActive(data);
    };
    const setLocalTempGraphicsLayer = (data) => {
        ltgRef.current = data;
        _setLocalTempGraphicsLayer(data);
    };
    const setGeometryType = (data) => {
        geometryTypeRef.current = data;
        _setGeometryType(data);
    };

    const redo = () => {
        sketchViewModel.redo();
    };

    const undo = () => {
        sketchViewModel.undo();
    };

    const removeSelection = () => {
        const {
            sketchSaveData,
            data,
            editedLayers,
            featureType,
            addressField,
            hasTableEdited,
        } = props;

        const layer = editedLayers.filter(l => l.id === data[0]._layerId);
        sketchSaveData(view, layer, featureType, addressField, hasTableEdited);
        view.popup.close();
    };

    const toggleSelectTools = () => {
        const { isOpen, setActiveToolMenu } = props;
        if (isOpen) {
            setActiveToolMenu('');
        } else {
            setActiveToolMenu('sketchTools');
        }
    };

    const acceptSketch = async () => {
        const {
            draw,
            setActiveTool,
            setActiveModal,
            editModeActive,
            setTempGraphicsLayer,
            setActiveFeatureMode,
            data,
            layerList,
            activeAdminTool,
        } = props;

        const kayttoikParentLayer = layerList.find(l => l.name === 'Käyttöoikeussopimukset');
        const tempGraphics = localTempGraphicsLayer.graphics.items
            .filter((graphic) => graphic.type === 'sketch-graphic')
            .filter((graphic, index, self) => index === self.findIndex((t) => t.uid === graphic.uid));
        if (kayttoikParentLayer
            && activeAdminTool === kayttoikParentLayer.id
            && tempGraphics && tempGraphics.length
            && tempGraphics[0].attributes
            && tempGraphics[0].attributes.SOPIMUSTUNNISTE !== null
            && data && data.length
        ) {
            console.log('IF', tempGraphics);
            const objectIdFieldName = kayttoikParentLayer.fields.find(field => field.type === 'esriFieldTypeOID').name;
            const newData = {
                geometry: tempGraphics[0].geometry,
                attributes: { [objectIdFieldName]: tempGraphics[0].attributes[objectIdFieldName] },
            };
            resetMapTools(draw, sketchViewModel, setActiveTool);
            await save.saveData(
                'update',
                view,
                kayttoikParentLayer.id,
                [newData],
                objectIdFieldName,
                false,
                true,
            );
            localTempGraphicsLayer.graphics = undefined;
            setActiveFeatureMode('create');
        } else {
            console.log('ELSE', tempGraphics);
            setActiveModal(editModeActive);
            resetMapTools(draw, sketchViewModel, setActiveTool);
        }
    };
    const showAdminView = (): boolean => {
        const { activeAdminTool, layerList } = props;

        if (activeAdminTool === '') {
            return false;
        }
        const layer = layerList.find(l => l.id === activeAdminTool);
        return layer ? layer.type !== 'agfl' && !nestedVal(layer, ['propertyIdField']) && layer.layerPermission.createLayer : false;
    };

    const validGeometry = () => {
        if (localTempGraphicsLayer) {
            const currentGeomItems = localTempGraphicsLayer.graphics.items
                .filter(item => item.type === 'sketch-graphic');

            return !currentGeomItems.some(item => item.geometry.isSelfIntersecting);
        }

        return false;
    };

    const removeSketch = () => {
        const {
            setActiveFeatureMode,
            draw,
            setActiveTool,
            resetFeatureNoGeometry,
        } = props;

        setActiveFeatureMode('create');
        const layer = ltgRef.current;
        layer.graphics = undefined;
        props.setTempGraphicsLayer(layer);
        sketchViewModel.cancel();
        resetMapTools(draw, sketchViewModel, setActiveTool);
        resetFeatureNoGeometry();
    };

    useEffect(() => {
        switch (props.geometryType) {
            case 'esriGeometryPolygon':
                setState({ ...state, editSketchIcon: 'polygon' });
                break;
            case 'esriGeometryMultipoint':
                setState({ ...state, editSketchIcon: 'handle-horizontal' });
                break;
            case 'esriGeometryPoint':
                setState({ ...state, editSketchIcon: 'blank-map-pin' });
                break;
            case 'esriGeometryPolyline':
                setState({ ...state, editSketchIcon: 'polyline' });
                break;
            case 'esriGeometryEnvelope':
                setState({ ...state, editSketchIcon: 'checkbox-unchecked' });
                break;
            case 'esriGeometryCircularArc':
                setState({ ...state, editSketchIcon: 'radio-unchecked' });
                break;
            default:
                setState({ ...state, editSketchIcon: 'polygon' });
        }
        if (props.geometryType !== geometryType) {
            setGeometryType(props.geometryType);
        }
        if (props.draw.initialized) {
            removeSketch();
            resetMapTools(props.draw, props.sketchViewModel, props.setActiveTool);
        }
    }, [props.activeAdminTool, props.geometryType]);

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

    const updatePolygonLabels = () => {
        // Remove existing labels
        const labelGraphics = localTempGraphicsLayer.graphics.items
            .filter(graphic => graphic.type === 'draw-measure-label');
        labelGraphics.forEach(label => localTempGraphicsLayer.remove(label));

        const sketchGraphic = localTempGraphicsLayer.graphics.items.find(a => a.type === 'sketch-graphic');
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
                    localTempGraphicsLayer.add(areaLabel);
                });
            }
        }
    };

    const createSketchOutLineLabelGraphic = (geometry, value, type, id) => new Graphic({
        geometry,
        symbol: {
            type: 'text',
            color: '#000000',
            text: value || '',
            font: {
                size: 12,
                family: 'sans-serif',
                weight: 'bold',
            },
        },
        type,
        id,
    });
    const removeLengthLabels = async () => {
        if (localTempGraphicsLayer && localTempGraphicsLayer.graphics) {
            const labels = localTempGraphicsLayer.graphics.items.filter(i => i.type === 'sketch-polygon-side-length');
            localTempGraphicsLayer.removeMany(labels);
        }
    };

    const drawPolygonOutlineLengths = (rings: number[][][], noDuplicates?: boolean) => {
        removeLengthLabels();

        rings.forEach((ring, i) => {
            if (ring.length > (noDuplicates ? 2 : 3)) {
                ring.forEach((point, j) => {
                    if (j < ring.length - 1) {
                        const x1 = point[0];
                        const x2 = ring[j + 1][0];
                        const y1 = point[1];
                        const y2 = ring[j + 1][1];
                        const measure = `${parseFloat(geometryEngine.distance(
                            new Point({
                                x: x1,
                                y: y1,
                                spatialReference: view.spatialReference,
                            }),
                            new Point({
                                x: x2,
                                y: y2,
                                spatialReference: view.spatialReference,
                            }),
                        )).toFixed(2)} m`;
                        const label = createSketchOutLineLabelGraphic(
                            new Point({
                                x: (x1 + x2) / 2,
                                y: (y1 + y2) / 2,
                                spatialReference: view.spatialReference,
                            }),
                            measure,
                            'sketch-polygon-side-length',
                            `sketch-polygon-side-length-${i}-${j}`,
                        );
                        localTempGraphicsLayer.add(label);
                    }
                });
            }
        });
    };

    const updateLabels = (rings, geometry) => {
        const polygon = createPolygon(rings);
        const measure = measurement(polygon);
        const areaLabel = createLabelGraphic(geometry, measure);

        updatePolygonLabels();
        localTempGraphicsLayer.add(areaLabel);

        drawPolygonOutlineLengths(rings);
    };

    const selectFeaturesFromDraw = async (event) => {
        if (
            event.state === 'active'
                && event.tool === 'polygon'
                && activeStateRef.current === 'sketchActiveAdmin'
        ) {
            if (event.graphic.geometry.isSelfIntersecting
                    || event.graphic.geometry.rings.length > 1) {
                event.graphic.symbol = createSketchLineGraphic(false);
                setState({ ...state, validGeometry: false });
            } else {
                event.graphic.symbol = createSketchLineGraphic(true);

                if (event.graphic !== null
                        && event.graphic.geometry.rings[0].length > 2) {
                    const { geometry } = event.graphic;
                    const { rings } = geometry;
                    updateLabels(rings, geometry);
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
            } = props;

            console.log('COMPLETE', event);

            const ltg = ltgRef.current;

            // Skip finding layers if Administrator editing is in use
            if (activeStateRef.current === 'sketchActiveAdmin') {
                await removeLengthLabels();
                if (graphic.geometry.type === 'polygon' && (graphic.geometry.isSelfIntersecting
                    || graphic.geometry.rings.length > 1)) {
                    const clonedSymbol = graphic.symbol.clone();
                    clonedSymbol.outline = createSketchOutlineGraphic(false);
                    graphic.symbol = sketchSymbol;
                }

                graphic.type = 'sketch-graphic';

                // Combine multiple polygons into multipolygon
                if (event.tool === 'polygon') {
                    const sketchGraphicItems = ltg.graphics.items
                        .filter(item => item.type === 'sketch-graphic');
                    const combinedRings = sketchGraphicItems
                        .filter(item => item.type === 'sketch-graphic').flatMap(item => item.geometry.rings);
                    const firstSketchGraphic = ltg.graphics.items
                        .find(item => item.type === 'sketch-graphic');
                    firstSketchGraphic.geometry.rings = combinedRings;
                    firstSketchGraphic.symbol = sketchSymbol;

                    await sketchViewModel.update(firstSketchGraphic);
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
                ltg.remove(event.graphic);

                await queryFeatures(
                    geometry,
                    view,
                    selectFeatures,
                );
            }
        } else if (event.state === 'cancel') {
            removeLengthLabels();
            updatePolygonLabels();
        }
        setState({
            ...state,
            validGeometry: validGeometry(),
            canRedo: sketchViewModel.canRedo(),
            canUndo: sketchViewModel.canUndo(),
        });
    };

    const getMovingPointFromPolygon = (movingPoint, polygonSketch) => {
        let ringsIdx;
        let pointIdx;
        const matchingPolygon = polygonSketch.find((pol) => {
            const mathingRing = pol.rings.findIndex((ring) => {
                const mathingPoint = ring.findIndex(
                    point => point[0] === movingPoint.x
                            && point[1] === movingPoint.y,
                );
                if (mathingPoint >= 0) {
                    pointIdx = mathingPoint;
                    return true;
                }
                return false;
            });
            if (mathingRing >= 0) {
                ringsIdx = mathingRing;
                return true;
            }
            return false;
        });
        return {
            ringsIdx,
            pointIdx,
            matchingPolygon,
        };
    };

    const drawSideLengthsToNearest = (event) => {
        const movingPoint = event.toolEventInfo.mover.geometry;
        const polygonSketch = localTempGraphicsLayer.graphics.items
            .filter(item => item.type === 'sketch-graphic' && item.geometry.type === 'polygon')
            .map(pol => pol.geometry);

        const {
            ringsIdx, pointIdx, matchingPolygon,
        } = getMovingPointFromPolygon(movingPoint, polygonSketch);

        if (matchingPolygon) {
            const points = [];
            const { rings } = matchingPolygon;
            if (pointIdx === 0) {
                points.push(
                    rings[ringsIdx][rings[ringsIdx].length - 2],
                    rings[ringsIdx][pointIdx],
                    rings[ringsIdx][pointIdx + 1],
                );
            } else {
                points.push(
                    rings[ringsIdx][pointIdx - 1],
                    rings[ringsIdx][pointIdx],
                    rings[ringsIdx][pointIdx + 1],
                );
            }
            drawPolygonOutlineLengths([points], true);
        }
    };

    const handleUndoRedo = (event) => {
        if (['undo', 'redo'].includes(event.type)) {
            if (event.tool === 'polygon') {
                const { geometry } = event.graphics[0];
                updateLabels(geometry.rings, geometry);
            }
        }
    };

    const handleReshape = (event) => {
        if (event.toolEventInfo && event.toolEventInfo.type.startsWith('reshape')) {
            switch (event.toolEventInfo.type) {
                case 'reshape':
                    drawSideLengthsToNearest(event);
                    break;
                case 'reshape-stop':
                    removeLengthLabels();
                    break;
                default:
                    break;
            }
        }
    };

    const onUpdate = async (event) => {
        const eventInfoType = event?.toolEventInfo?.type;
        const eventGeometryType = event?.toolEventInfo?.mover?.geometry?.type;

        if (eventInfoType?.startsWith('move-start') && eventGeometryType !== 'point') {
            sketchViewModel.cancel();
        }

        const shouldBeRemoved = ltgRef.current.graphics?.items
            ?.find((graphic) => graphic.type === 'sketch-graphic' && graphic.uid !== event.graphics[0].uid);

        if (shouldBeRemoved) {
            ltgRef.current.graphics?.remove(shouldBeRemoved);
        }

        updatePolygonLabels();
        handleReshape(event);
        handleUndoRedo(event);

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
        setState({
            ...state,
            validGeometry: validGeometry(),
            canRedo: sketchViewModel.canRedo(),
            canUndo: sketchViewModel.canUndo(),
        });
    };

    useEffect(() => {
        setLocalTempGraphicsLayer(props.tempGraphicsLayer);
    }, [props.tempGraphicsLayer]);

    useEffect(() => {
        setSketchViewModel(props.sketchViewModel);
    }, [props.sketchViewModel]);

    useEffect(() => {
        setActive(props.active);
    }, [props.active]);

    const initSketchTool = () => {
        sketchViewModel.on('create', selectFeaturesFromDraw);
        sketchViewModel.on(['redo', 'undo', 'update'], onUpdate);

        const {
            draw,
            setActiveTool,
            setActiveToolMenu,
            resetFeatureNoGeometry,
        } = props;

        const drawNewFeatureButton = drawNewFeatureButtonRef.current;
        const drawNewAreaButton = drawNewAreaButtonRef.current;
        const drawRectangleButton = drawRectangleButtonRef.current;
        const drawPolygonButton = drawPolygonButtonRef.current;
        const drawCircleButton = drawCircleButtonRef.current;

        drawNewFeatureButton.addEventListener('click', (event) => {
            // user cannot draw more than 1 sketch
            if (drawNewFeatureButton.classList.contains('disabled')) {
                event.preventDefault();
                return;
            }
            if (activeStateRef.current === 'sketchActiveAdmin') {
                setActiveToolMenu('');
                resetMapTools(draw, sketchViewModel, setActiveTool);
                resetFeatureNoGeometry();
            } else if (!activeStateRef.current) {
                view.popup.close();
                setActiveToolMenu('sketchActiveAdmin');
                resetMapTools(draw, sketchViewModel, setActiveTool);
                setActiveTool('sketchActiveAdmin');
                const convertedGeometryType = convertEsriGeometryType(geometryTypeRef.current);
                sketchViewModel.create(convertedGeometryType);
                drawNewFeatureButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawNewAreaButton.addEventListener('click', () => {
            const convertedGeometryType = convertEsriGeometryType(geometryTypeRef.current);
            sketchViewModel.create(convertedGeometryType);
            console.log('click', ltgRef.current?.graphics?.items, props.tempGraphicsLayer?.graphics?.items);
            drawNewAreaButton.style.backgroundColor = styles.colorMainDark;
        });

        drawRectangleButton.addEventListener('click', () => {
            if (activeStateRef.current === 'sketchRectangle') {
                resetMapTools(draw, sketchViewModel, setActiveTool);
            } else {
                resetMapTools(draw, sketchViewModel, setActiveTool);
                setActiveTool('sketchRectangle');
                sketchViewModel.create('rectangle');
                drawRectangleButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawPolygonButton.addEventListener('click', () => {
            if (activeStateRef.current === 'sketchPolygon') {
                resetMapTools(draw, sketchViewModel, setActiveTool);
            } else {
                resetMapTools(draw, sketchViewModel, setActiveTool);
                setActiveTool('sketchPolygon');
                sketchViewModel.create('polygon');
                drawPolygonButton.style.backgroundColor = styles.colorMainDark;
            }
        });

        drawCircleButton.addEventListener('click', () => {
            if (activeStateRef.current === 'sketchCircle') {
                resetMapTools(draw, sketchViewModel, setActiveTool);
            } else {
                resetMapTools(draw, sketchViewModel, setActiveTool);
                setActiveTool('sketchCircle');
                sketchViewModel.create('circle');
                drawCircleButton.style.backgroundColor = styles.colorMainDark;
            }
        });
    };

    useEffect(() => {
        if (localTempGraphicsLayer && sketchViewModel) {
            initSketchTool();
        }
    }, [sketchViewModel, localTempGraphicsLayer]);

    const hasAdminGraphics = localTempGraphicsLayer
        && localTempGraphicsLayer.graphics
        && localTempGraphicsLayer.graphics.filter(g => g.type === 'sketch-graphic').length > 0;
    const showNewAreaButton = hasAdminGraphics && state.editSketchIcon === 'polygon';

    return (
        <>
            <SketchToolView
                removeSelection={removeSelection}
                drawRectangleButtonRef={drawRectangleButtonRef}
                drawPolygonButtonRef={drawPolygonButtonRef}
                drawCircleButtonRef={drawCircleButtonRef}
                toggleSelectToolsButtonRef={toggleSelectToolsButton}
                toggleTools={toggleSelectTools}
                hasSelectedFeatures={props.data.length > 0}
                isOpen={props.isOpen}
                view={props.view}
                activeTool={props.active}
            />
            <SketchActiveAdminView
                editSketchIcon={state.editSketchIcon}
                removeSketch={removeSketch}
                acceptSketch={acceptSketch}
                showAdminView={showAdminView()}
                drawNewFeatureButtonRef={drawNewFeatureButtonRef}
                drawNewAreaButtonRef={drawNewAreaButtonRef}
                hasAdminGraphics={hasAdminGraphics}
                validGeometry={validGeometry}
                activeTool={props.active}
                showNewAreaButton={showNewAreaButton}
                redo={redo}
                undo={undo}
                canRedo={state.canRedo}
                canUndo={state.canUndo}
            />
        </>
    );
}
