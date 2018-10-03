// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { fetchWorkspace } from '../../../api/workspace/userWorkspace';
import { mapSelectPopup } from '../../../utils/map-selection/mapSelectPopup';
import { queryFeatures } from '../../../utils/queryFeatures';
import { loadWorkspace } from '../../../utils/workspace/loadWorkspace';
import EsriMapContainer from './esri-map/EsriMapContainer';
import { getStreetViewLink } from '../../../utils/map-selection/streetView';

type Props = {
    layerList: Array<any>,
    mapCenter: Array<number>,
    mapScale: number,
    printServiceUrl: ?string,
    selectFeatures: Function,
    setMapView: (view: Object) => void,
    activeAdminTool: string,
    sketchViewModel: Object,
    setEditMode: (editMode: string) => void,
    editMode: string,
    setTempGraphicsLayer: (graphicsLayer: Object) => void,
    activeTool: string,
    setHasGraphics: (hasGraphics: boolean) => void,
    searchWorkspaceFeatures: Function,
    setWorkspaceRejected: Function,
    initialLoading: boolean,
    setActiveModal: Function,
    setSingleLayerGeometry: Function,
};

class EsriMap extends Component<Props> {
    printWidget: ?Object = null; // eslint-disable-line react/sort-comp

    componentDidUpdate(prevProps: Props) {
        const { initialLoading } = this.props;

        if (!initialLoading && initialLoading !== prevProps.initialLoading) {
            this.initMap();
        }
    }

    initMap = () => {
        esriLoader.loadCss('https://js.arcgis.com/4.9/esri/css/main.css');

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
            ]) => {
                const {
                    layerList,
                    mapCenter,
                    mapScale,
                    selectFeatures,
                    printServiceUrl,
                    setActiveModal,
                    setSingleLayerGeometry,
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
                        maxScale: 2000,
                        minScale: 5000000,
                    },
                    popup: {
                        collapseEnabled: false,
                        dockOptions: {
                            position: 'top-left',
                        },
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
                        'measure-tool-outer-wrapper',
                        'draw-tool-outer-wrapper',
                        'select-tool-outer-wrapper',
                        'create-new-feature-wrapper',
                    ],
                    'top-right',
                );
                view.ui.add([scaleBar], 'bottom-left');

                view.on('click', (event) => {
                    // Return if update sketch is ongoing
                    if (this.props.editMode === 'update') return;
                    view.hitTest(event).then((response) => {
                        let { results } = response;
                        // Found results
                        if (results.length) {
                            if (this.props.activeTool === 'drawErase') {
                                view.popup.close();
                                results.forEach((r) => {
                                    if (r.graphic && r.graphic.type === 'draw-graphic') {
                                        view.graphics.remove(r.graphic);
                                        const hasGraphics = view
                                            && view.graphics
                                            && view.graphics.filter(g => g.type === 'draw-graphic').length > 0;
                                        this.props.setHasGraphics(hasGraphics);
                                    }
                                });
                            } else {
                                results = results.filter(item =>
                                    item.graphic.id !== 'highlight'
                                    && item.graphic.id !== 'buffer'
                                    && item.graphic.id !== 'drawMeasure'
                                    && item.graphic.type !== 'draw-graphic');

                                const layer = results.find(l => l
                                    .graphic.layer.id.indexOf('layer') >= 0);

                                // Check if we're already editing a graphic
                                if (layer && this.props.editMode === '') {
                                    // Save a reference to the graphic we intend to update
                                    const { graphic } = layer;
                                    this.props.setEditMode('update');
                                    // Remove the graphic from the GraphicsLayer
                                    // Sketch will handle displaying the graphic while being updated
                                    tempGraphicsLayer.remove(graphic);
                                    this.props.sketchViewModel.update(graphic);
                                } else if (this.props.editMode === 'finish') {
                                    this.props.setEditMode('');
                                } else if (event.button === 0) {
                                    const { activeAdminTool } = this.props;
                                    const swLink = getStreetViewLink(
                                        event.mapPoint.x,
                                        event.mapPoint.y,
                                    );
                                    mapSelectPopup(
                                        results,
                                        swLink,
                                        view,
                                        selectFeatures,
                                        layerList,
                                        activeAdminTool,
                                    );
                                }
                            }
                        }
                    });
                });

                (document.getElementById: Function)('select-tool-outer-wrapper').classList
                    .remove('esri-component');

                (document.getElementById: Function)('measure-tool-outer-wrapper').classList
                    .remove('esri-component');

                (document.getElementById: Function)('draw-tool-outer-wrapper').classList
                    .remove('esri-component');

                (document.getElementById: Function)('create-new-feature-wrapper').classList
                    .remove('esri-component');

                view.popup.on('trigger-action', (evt) => {
                    if (evt.action.id === 'select-intersect') {
                        const layerId = view.popup.viewModel.selectedFeature.layer.id;
                        const featureGeom = view.popup.viewModel.selectedFeature.geometry;
                        const { activeAdminTool } = this.props;
                        queryFeatures(featureGeom, activeAdminTool, view, selectFeatures, layerId);
                    } else if (evt.action.id === 'set-buffer') {
                        setSingleLayerGeometry(view.popup.viewModel.selectedFeature.geometry);
                        setActiveModal('bufferSelectedData');
                    }
                });

                return { view, tempGraphicsLayer };
            })
            .then((r) => {
                const {
                    setWorkspaceRejected,
                    layerList,
                    selectFeatures,
                    searchWorkspaceFeatures,
                    setMapView,
                    setTempGraphicsLayer,
                } = this.props;

                // Set initial view and temp graphics layer to redux
                setMapView(r.view);
                setTempGraphicsLayer(r.tempGraphicsLayer);

                // Initial workspace load, fetches users latest workspace.
                fetchWorkspace(null)
                    .then((workspace) => {
                        if (workspace) {
                            loadWorkspace(
                                workspace,
                                layerList,
                                r.view,
                                searchWorkspaceFeatures,
                                selectFeatures,
                            );
                        } else {
                            setWorkspaceRejected();
                        }
                    })
                    .catch(err => console.log(err));
            });
    };

    render() {
        return <EsriMapContainer printWidget={this.printWidget} />;
    }
}

export default EsriMap;
