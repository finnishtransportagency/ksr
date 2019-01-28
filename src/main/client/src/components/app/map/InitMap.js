// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import clone from 'clone';
import { isMobile } from 'react-device-detect';
import { fetchWorkspace } from '../../../api/workspace/userWorkspace';
import { mapSelectPopup } from '../../../utils/map-selection/mapSelectPopup';
import { queryFeatures } from '../../../utils/queryFeatures';
import { getWorkspaceFromUrl, loadWorkspace } from '../../../utils/workspace/loadWorkspace';
import EsriMapContainer from './esri-map/EsriMapContainer';
import { getStreetViewLink } from '../../../utils/map-selection/streetView';
import {
    colorBackgroundDark,
    colorMainDark,
    mapHighlightStroke,
} from '../../ui/defaultStyles';
import { nestedVal } from '../../../utils/nestedValue';
import strings from '../../../translations';
import { copyFeature } from '../../../utils/map-selection/copyFeature';
import { removeGraphicsFromMap, getLayerFields } from '../../../utils/map';

type Props = {
    layerList: Array<any>,
    mapCenter: Array<number>,
    mapScale: number,
    printServiceUrl: ?string,
    addNonSpatialContentToTable: Function,
    selectFeatures: Function,
    setMapView: (view: Object) => void,
    activeAdminTool: string,
    sketchViewModel: Object,
    geometryType: string,
    setTempGraphicsLayer: (graphicsLayer: Object) => void,
    activeTool: string,
    setHasGraphics: (hasGraphics: boolean) => void,
    searchWorkspaceFeatures: Function,
    setWorkspaceRejected: Function,
    initialLoading: boolean,
    setActiveModal: Function,
    setSingleLayerGeometry: Function,
    setPropertyInfo: (
        queryParameter: Object | string,
        view: Object,
        graphicId: string,
        authorities: Object[],
    ) => void,
    authorities: Object[],
    setContractListInfo: (
        layerId: string,
        objectId: number,
    ) => void,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    setLayerList: (layerList: Object[]) => void,
    setActiveFeatureMode: (activeMode: string) => void,
    editModeActive: boolean,
};

class EsriMap extends Component<Props> {
    legendWidget: ?Object = null; // eslint-disable-line react/sort-comp
    printWidget: ?Object = null; // eslint-disable-line react/sort-comp

    componentDidUpdate(prevProps: Props) {
        const { initialLoading } = this.props;

        if (!initialLoading && initialLoading !== prevProps.initialLoading) {
            this.initMap();
        }
    }

    initMap = () => {
        esriLoader.loadCss('https://js.arcgis.com/4.10/esri/css/main.css');

        esriLoader
            .loadModules([
                'esri/views/MapView',
                'esri/Map',
                'esri/widgets/Locate',
                'esri/widgets/Track',
                'esri/widgets/ScaleBar',
                'esri/geometry/SpatialReference',
                'esri/widgets/Compass',
                'esri/geometry/Point',
                'esri/widgets/Print',
                'esri/layers/GraphicsLayer',
                'esri/Graphic',
                'esri/widgets/Legend',
                'esri/widgets/CoordinateConversion',
                'esri/widgets/CoordinateConversion/support/Conversion',
            ])
            .then(([
                MapView,
                Map,
                Locate,
                Track,
                ScaleBar,
                SpatialReference,
                Compass,
                Point,
                Print,
                GraphicsLayer,
                Graphic,
                Legend,
                CoordinateConversion,
                Conversion,
            ]) => {
                const {
                    mapCenter,
                    mapScale,
                    selectFeatures,
                    printServiceUrl,
                } = this.props;

                // GraphicsLayer to hold graphics created via sketch view model
                const tempGraphicsLayer = new GraphicsLayer();
                const map = new Map({
                    layers: [tempGraphicsLayer],
                });

                const epsg3067 = new SpatialReference(3067);

                const center = new Point({
                    x: mapCenter[0],
                    y: mapCenter[1],
                    spatialReference: epsg3067,
                });

                const view = new MapView({
                    container: 'mapView',
                    map,
                    center,
                    scale: mapScale,
                    spatialReference: epsg3067,
                    constraints: {
                        maxScale: 500,
                        minScale: 5000000,
                    },
                    popup: {
                        autoOpenEnabled: false,
                        collapseEnabled: false,
                        dockOptions: {
                            position: 'top-left',
                        },
                        highlightEnabled: false,
                        spinnerEnabled: true,
                    },
                    highlightOptions: {
                        color: mapHighlightStroke,
                        fillOpacity: 0,
                    },
                });

                const compass = new Compass({
                    view,
                });

                const locate = new Locate({
                    view,
                });

                const track = new Track({
                    view,
                });

                const scaleBar = new ScaleBar({
                    view,
                    unit: 'metric',
                });

                this.legendWidget = new Legend({
                    view,
                    style: {
                        type: 'card',
                    },
                });

                this.printWidget = new Print({
                    view,
                    printServiceUrl,
                });

                view.ui.move('zoom', 'top-right');
                view.ui.add(
                    [
                        compass,
                        locate,
                        track,
                        'draw-tool-outer-wrapper',
                        'select-tool-outer-wrapper',
                        'create-new-feature-wrapper',
                    ],
                    'top-right',
                );
                view.ui.add([scaleBar], 'bottom-left');

                if (!isMobile) {
                    const coordinateWidget = new CoordinateConversion({
                        view,
                        multipleConversions: false,
                    });

                    const formats = coordinateWidget.formats
                        .filter(f => f.name === 'basemap' || f.name === 'xy');

                    const epsg = formats.items.find(format => format.name === 'basemap');
                    const wgs = formats.items.find(format => format.name === 'xy');

                    if (epsg && wgs) {
                        const epsgClone = clone(epsg, true, 3);
                        epsgClone.name = 'EPSG:3067';
                        const wgsClone = clone(wgs, true, 3);
                        wgsClone.name = 'WGS84';

                        coordinateWidget.formats.removeAll();
                        coordinateWidget.formats.addMany([epsgClone, wgsClone]);

                        coordinateWidget.conversions.removeAll();
                        coordinateWidget.conversions.add(new Conversion({format: epsgClone}));
                        view.ui.add([coordinateWidget], 'bottom-right');
                    }
                }

                // Change compass widgets default dial icon to compass icon.
                view.when(() => {
                    const compassIcon = document.getElementsByClassName('esri-icon-dial')[0];
                    compassIcon.classList.remove('esri-icon-dial');
                    compassIcon.classList.add('esri-icon-compass');
                });

                view.on('click', (event) => {
                    view.popup.close();

                    view.hitTest(event).then(async (response) => {
                        const { results } = response;
                        const { layerList } = this.props;
                        const filteredResults = results.filter(item =>
                            item.graphic.id !== 'buffer'
                            && item.graphic.type !== 'draw-graphic'
                            && item.graphic.type !== 'draw-measure-label'
                            && item.graphic.id !== 'selected-popup-feature'
                            && item.graphic.id !== 'propertyArea');

                        if (this.props.activeTool !== 'drawErase' && !filteredResults.find(item =>
                            item.graphic.layer.type === 'graphics')) {
                            const { activeAdminTool, geometryType } = this.props;
                            view.popup.open({
                                location: event.mapPoint,
                                promises: [mapSelectPopup(
                                    filteredResults,
                                    view,
                                    selectFeatures,
                                    layerList,
                                    activeAdminTool,
                                    geometryType,
                                    event.x,
                                    event.y,
                                )],
                            });
                        }

                        if (results.length) {
                            if (this.props.activeTool === 'drawErase') {
                                results.forEach((r) => {
                                    if (r.graphic && (r.graphic.type === 'draw-graphic'
                                        || r.graphic.type === 'draw-measure-label')) {
                                        const graphicsToRemove = view.graphics
                                            .filter(g => g.id === r.graphic.id);
                                        view.graphics.removeMany(graphicsToRemove);
                                        const hasGraphics = view
                                            && view.graphics
                                            && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
                                        this.props.setHasGraphics(hasGraphics);
                                    }
                                });
                            }
                        }
                    });
                });

                (document.getElementById: Function)('select-tool-outer-wrapper').classList
                    .remove('esri-component');

                (document.getElementById: Function)('draw-tool-outer-wrapper').classList
                    .remove('esri-component');

                (document.getElementById: Function)('create-new-feature-wrapper').classList
                    .remove('esri-component');

                view.popup.on('trigger-action', async (evt) => {
                    const {
                        layerList,
                        setActiveModal,
                        setSingleLayerGeometry,
                        setPropertyInfo,
                        setContractListInfo,
                        showConfirmModal,
                        activeAdminTool,
                        authorities,
                        setActiveFeatureMode,
                        sketchViewModel,
                        setTempGraphicsLayer,
                        editModeActive,
                    } = this.props;
                    const { x, y } = view.popup.location;

                    const selectedFeature = nestedVal(
                        view,
                        ['popup', 'viewModel', 'selectedFeature'],
                    );

                    const geometry = nestedVal(selectedFeature, ['geometry']);
                    const layer = layerList.find(ll => nestedVal(
                        selectedFeature,
                        ['layer', 'id'],
                    ) === ll.id);

                    const objectIdField = nestedVal(selectedFeature, ['layer', 'objectIdField']);
                    const objectId = nestedVal(selectedFeature, ['attributes', objectIdField]);

                    const copySelectedFeature = async (activeFeatureMode: string) => {
                        const copiedFeature = view.popup.viewModel.selectedFeature;
                        if (tempGraphicsLayer.graphics.length) {
                            const {
                                body,
                                acceptText,
                                cancelText,
                            } = editModeActive
                                ? strings.esriMap.confirmEditReplace
                                : strings.esriMap.confirmReplace;
                            showConfirmModal(body, acceptText, cancelText, async () => {
                                await copyFeature(
                                    view,
                                    tempGraphicsLayer,
                                    copiedFeature,
                                    sketchViewModel,
                                    setTempGraphicsLayer,
                                );
                                setActiveFeatureMode(activeFeatureMode);
                            });
                        } else {
                            await copyFeature(
                                view,
                                tempGraphicsLayer,
                                copiedFeature,
                                sketchViewModel,
                                setTempGraphicsLayer,
                            );
                            setActiveFeatureMode(activeFeatureMode);
                        }
                    };

                    switch (evt.action.id) {
                        case 'select-intersect':
                            queryFeatures(
                                geometry,
                                activeAdminTool,
                                view,
                                selectFeatures,
                                layer && layer.id,
                            );
                            break;
                        case 'set-buffer':
                            setSingleLayerGeometry(geometry);
                            setActiveModal('bufferSelectedData');
                            break;
                        case 'get-property-info':
                            setPropertyInfo({ x, y }, view, 'propertyArea', authorities);
                            break;
                        case 'google-street-view':
                            getStreetViewLink(x, y);
                            break;
                        case 'contract-link':
                            if (layer) {
                                setContractListInfo(layer.id, objectId);
                                setActiveModal('featureContracts');
                            }
                            break;
                        case 'copy-feature':
                            await copySelectedFeature('create');
                            break;
                        case 'edit-feature':
                            await copySelectedFeature('edit');
                            break;
                        default:
                            break;
                    }
                });

                view.popup.viewModel.watch('selectedFeature', (selectedFeature) => {
                    removeGraphicsFromMap(view, 'selected-popup-feature');

                    if (selectedFeature && selectedFeature.geometry) {
                        const newFeature = new Graphic({
                            geometry: selectedFeature.geometry,
                            id: 'selected-popup-feature',
                        });
                        switch (newFeature.geometry.type) {
                            case 'point':
                                newFeature.symbol = {
                                    type: 'simple-marker',
                                    style: 'circle',
                                    size: 6,
                                    color: colorMainDark,
                                    outline: {
                                        color: colorBackgroundDark,
                                        width: 1,
                                    },
                                };
                                break;
                            case 'polyline':
                                newFeature.symbol = {
                                    type: 'simple-line',
                                    color: colorMainDark,
                                    width: 2,
                                };
                                break;
                            default:
                                newFeature.symbol = {
                                    type: 'simple-fill',
                                    color: colorMainDark,
                                    outline: {
                                        color: colorBackgroundDark,
                                        width: 1,
                                    },
                                };
                                break;
                        }
                        view.graphics.add(newFeature);
                    }
                });

                view.popup.watch('visible', (visible) => {
                    if (!visible) {
                        removeGraphicsFromMap(view, 'selected-popup-feature');
                    }
                });

                return { view, tempGraphicsLayer };
            })
            .then(async (r) => {
                const {
                    setWorkspaceRejected,
                    layerList,
                    selectFeatures,
                    searchWorkspaceFeatures,
                    setMapView,
                    setTempGraphicsLayer,
                    addNonSpatialContentToTable,
                    setLayerList,
                } = this.props;

                // Set initial view and temp graphics layer to redux
                setMapView(r.view);
                setTempGraphicsLayer(r.tempGraphicsLayer);

                let workspace = await getWorkspaceFromUrl();
                if (workspace) {
                    await loadWorkspace(
                        workspace,
                        layerList,
                        r.view,
                        searchWorkspaceFeatures,
                        addNonSpatialContentToTable,
                        selectFeatures,
                        setLayerList,
                        null,
                    );
                } else {
                    workspace = await fetchWorkspace(null);
                    if (workspace) {
                        await loadWorkspace(
                            workspace,
                            layerList,
                            r.view,
                            searchWorkspaceFeatures,
                            addNonSpatialContentToTable,
                            selectFeatures,
                            setLayerList,
                            null,
                        );
                    } else {
                        const layersWithFields = await getLayerFields(
                            layerList,
                            layerList.filter(layer => layer.visible),
                        );
                        setLayerList(layersWithFields);
                        setWorkspaceRejected();
                    }
                }
                window.history.pushState({}, document.title, window.location.pathname);
            });
    };

    render() {
        return <EsriMapContainer printWidget={this.printWidget} legendWidget={this.legendWidget} />;
    }
}

export default EsriMap;
