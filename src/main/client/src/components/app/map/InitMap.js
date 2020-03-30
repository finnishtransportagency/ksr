// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import clone from 'clone';
import { isMobile } from 'react-device-detect';
import { fetchWorkspace } from '../../../api/workspace/userWorkspace';
import { mapSelectPopup } from '../../../utils/map-selection/mapSelectPopup';
import { queryFeatures } from '../../../utils/queryFeatures';
import { getWorkspaceFromUrl, loadWorkspace } from '../../../utils/workspace/loadWorkspace';
import EsriMapContainer from './esri-map/EsriMapContainer';
import { getStreetViewLink } from '../../../utils/map-selection/streetView';
import { colorBackgroundDark, colorFeatureHighlight, extentGraphic } from '../../ui/defaultStyles';
import { nestedVal } from '../../../utils/nestedValue';
import strings from '../../../translations';
import { copyFeature } from '../../../utils/map-selection/copyFeature';
import { addLayers, removeGraphicsFromMap } from '../../../utils/map';
import { DigitransitLocatorBuilder } from '../../../utils/geocode';

type Props = {
    layerList: Array<any>,
    mapCenter: Array<number>,
    mapScale: number,
    printServiceUrl: ?string,
    selectFeatures: Function,
    setMapView: (view: Object) => void,
    activeAdminTool: string,
    sketchViewModel: Object,
    geometryType: string,
    setTempGraphicsLayer: (graphicsLayer: Object) => void,
    activeTool: string,
    setHasGraphics: (hasGraphics: boolean) => void,
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
        accept: Function,
    ) => void,
    setActiveFeatureMode: (activeMode: string) => void,
    editModeActive: boolean,
    removeLoading: () => void,
    activateLayers: (layers: Object[], workspace?: Object) => void,
    deactivateLayer: (layerId: string) => void,
    setScale: number => void,
    setActiveNav: (selectedNav: string) => void,
};

class EsriMap extends Component<Props> {
    legendWidget: ?Object = null;

    printWidget: ?Object = null;

    componentDidUpdate(prevProps: Props) {
        const { initialLoading, printServiceUrl } = this.props;

        if (!initialLoading && initialLoading !== prevProps.initialLoading) {
            this.initMap();
        }

        if (printServiceUrl !== prevProps.printServiceUrl) {
            if (this.printWidget) this.printWidget.printServiceUrl = printServiceUrl;
        }
    }

    async initMap() {
        esriLoader.loadCss('https://js.arcgis.com/4.13/esri/css/main.css');

        const [
            MapView,
            Map,
            Locate,
            Track,
            ScaleBar,
            SpatialReference,
            Compass,
            geometryEngine,
            Circle,
            Point,
            Print,
            GraphicsLayer,
            Graphic,
            Legend,
            CoordinateConversion,
            Conversion,
            Search,
            watchUtils,
        ] = await esriLoader
            .loadModules([
                'esri/views/MapView',
                'esri/Map',
                'esri/widgets/Locate',
                'esri/widgets/Track',
                'esri/widgets/ScaleBar',
                'esri/geometry/SpatialReference',
                'esri/widgets/Compass',
                'esri/geometry/geometryEngine',
                'esri/geometry/Circle',
                'esri/geometry/Point',
                'esri/widgets/Print',
                'esri/layers/GraphicsLayer',
                'esri/Graphic',
                'esri/widgets/Legend',
                'esri/widgets/CoordinateConversion',
                'esri/widgets/CoordinateConversion/support/Conversion',
                'esri/widgets/Search',
                'esri/core/watchUtils',
            ]);

        const {
            mapCenter,
            mapScale,
            selectFeatures,
            printServiceUrl,
            setScale,
            layerList,
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
                color: colorFeatureHighlight,
                fillOpacity: 0,
            },
        });

        const l = layerList.find(ll => ll.name.toLowerCase() === 'taustakartta');
        // Create the MapView for overview map
        const overview = new MapView({
            container: 'overView',
            map: new Map(),
            constraints: {
                rotationEnabled: false,
                maxScale: 0,
                minScale: 18489297,
            },
            spatialReference: epsg3067,
        });

        await addLayers([l], overview, false, true);

        // Remove the default widgets
        overview.ui.components = [];

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

        const search = new Search({
            view,
            locationEnabled: false,
            includeDefaultSources: false,
            sources: [
                {
                    locator: new (await DigitransitLocatorBuilder.build())(),
                    placeholder: strings.geocode.placeholder,
                    name: 'Digitransit',
                },
            ],
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

        view.ui.add([search], 'top-right');
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
                epsgClone.name = 'ETRS-TM35FIN';
                const wgsClone = clone(wgs, true, 3);
                wgsClone.name = 'WGS84';

                coordinateWidget.formats.removeAll();
                coordinateWidget.formats.addMany([epsgClone, wgsClone]);

                coordinateWidget.conversions.removeAll();
                coordinateWidget.conversions.add(new Conversion({ format: epsgClone }));
                view.ui.add([coordinateWidget], 'bottom-right');
            }
        }

        overview.when(() => {
            view.when(() => {
                // Change compass widgets default dial icon to compass icon.
                const compassIcon = document.getElementsByClassName('esri-icon-dial')[0];
                compassIcon.classList.remove('esri-icon-dial');
                compassIcon.classList.add('esri-icon-compass');

                const extentgraphic = new Graphic({
                    geometry: null,
                    symbol: {
                        type: 'simple-fill',
                        color: extentGraphic,
                        outline: null,
                    },
                });
                overview.graphics.add(extentgraphic);

                // Get the new extent of the view only when view is stationary.
                watchUtils.whenTrue(view, 'stationary', () => {
                    if (view.extent) {
                        overview.goTo({
                            center: view.center,
                            scale:
                                view.scale
                                * 100,
                        });

                        extentgraphic.geometry = view.extent;
                    }
                });
            });
        });

        const stopEvtPropagation = (event) => {
            event.stopPropagation();
        };

        // disable mouse wheel scroll zooming on the view
        overview.on('mouse-wheel', stopEvtPropagation);

        // disable zooming via double-click on the view
        overview.on('double-click', stopEvtPropagation);

        // disable zooming out via double-click + Control on the view
        overview.on('double-click', ['Control'], stopEvtPropagation);

        // disables pinch-zoom and panning on the view
        overview.on('drag', stopEvtPropagation);

        // disable the view's zoom box to prevent the Shift + drag
        // and Shift + Control + drag zoom gestures.
        overview.on('drag', ['Shift'], stopEvtPropagation);
        overview.on('drag', ['Shift', 'Control'], stopEvtPropagation);

        // disable keyboard keys.
        overview.on('key-down', stopEvtPropagation);

        watchUtils.watch(view, 'scale', () => {
            setScale(view.scale);
        });

        view.on('click', (event) => {
            view.popup.close();
            view.hitTest(event).then(async (response) => {
                const { activeTool, setHasGraphics } = this.props;
                const { results } = response;

                if (activeTool === 'drawErase' && results.length) {
                    results.forEach((r) => {
                        if (r.graphic && (r.graphic.type === 'draw-graphic'
                            || r.graphic.type === 'draw-measure-label')) {
                            const graphicsToRemove = view.graphics
                                .filter(g => g.id === r.graphic.id);
                            view.graphics.removeMany(graphicsToRemove);
                            const hasGraphics = view
                                && view.graphics
                                && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
                            setHasGraphics(hasGraphics);
                        }
                    });
                } else if (!results.some(item => item.graphic.layer.type === 'graphics')) {
                    // Flow does not recognize flatMap so use any instead of Object[] for now.
                    const layers: any = await queryFeatures(
                        // Use scalable circle as click point to make point and line type features
                        // clickable as mapPoint coordinates are too precise to be usable.
                        new Circle({
                            center: event.mapPoint,
                            radius: view.scale / 500,
                        }),
                        view,
                        selectFeatures,
                    );
                    const features = layers ? layers.flatMap(layer => layer.features) : [];
                    const { activeAdminTool, geometryType } = this.props;
                    view.popup.open({
                        location: event.mapPoint,
                        promises: [mapSelectPopup(
                            features,
                            view,
                            layerList,
                            activeAdminTool,
                            geometryType,
                            event.x,
                            event.y,
                        )],
                    });
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
                setActiveModal,
                setSingleLayerGeometry,
                setPropertyInfo,
                setContractListInfo,
                showConfirmModal,
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
                case 'get-all-property-info': {
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
                    break;
                }
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
                case 'get-street-property-info':
                    if (x) {
                        const data = {
                            attributes: {},
                            geometry: {
                                x,
                                y,
                                type: 'point',
                            },
                            featureType: 'street',
                        };
                        setActiveModal('showAddress', data);
                    }
                    break;
                case 'get-road-property-info':
                    if (x) {
                        const data = {
                            attributes: {},
                            geometry: {
                                x,
                                y,
                                type: 'point',
                            },
                            featureType: 'road2',
                        };
                        setActiveModal('showAddress', data);
                    }
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
                            outline: {
                                color: colorBackgroundDark,
                                width: 1,
                            },
                        };
                        break;
                    case 'polyline':
                        newFeature.symbol = {
                            type: 'simple-line',
                            width: 2,
                        };
                        break;
                    default:
                        newFeature.symbol = {
                            type: 'simple-fill',
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

        const { removeLoading } = this.props;
        view.when(() => removeLoading());

        const {
            setWorkspaceRejected,
            setMapView,
            setTempGraphicsLayer,
            activateLayers,
            deactivateLayer,
            setActiveNav,
        } = this.props;

        // Set initial view and temp graphics layer to redux
        setMapView(view);
        setTempGraphicsLayer(tempGraphicsLayer);

        let workspace = await getWorkspaceFromUrl();
        if (workspace) {
            await loadWorkspace(
                workspace,
                layerList,
                view,
                activateLayers,
                deactivateLayer,
            );
        } else {
            workspace = await fetchWorkspace(null, false);
            if (workspace) {
                await loadWorkspace(
                    workspace,
                    layerList,
                    view,
                    activateLayers,
                    deactivateLayer,
                );
            } else {
                activateLayers(layerList.filter(layer => layer.visible));
                setWorkspaceRejected();
                setActiveNav('workspace');
            }
        }
        window.history.pushState({}, document.title, window.location.pathname);
    }

    render() {
        return <EsriMapContainer printWidget={this.printWidget} legendWidget={this.legendWidget} />;
    }
}

export default EsriMap;
