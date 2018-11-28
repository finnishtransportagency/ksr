// @flow
import esriLoader from 'esri-loader';
import React, { Component } from 'react';
import { fetchWorkspace } from '../../../api/workspace/userWorkspace';
import { mapSelectPopup } from '../../../utils/map-selection/mapSelectPopup';
import { queryFeatures } from '../../../utils/queryFeatures';
import { loadWorkspace } from '../../../utils/workspace/loadWorkspace';
import EsriMapContainer from './esri-map/EsriMapContainer';
import { getStreetViewLink } from '../../../utils/map-selection/streetView';
import { mapHighlightStroke } from '../../ui/defaultStyles';
import { getCaseManagementLink } from '../../../utils/map-selection/caseManagementLink';
import { getAlfrescoLink } from '../../../utils/map-selection/alfrescoLink';

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
    setPropertyInfo: (
        queryParameter: Object | string,
        view: Object,
        graphicId: string,
        authorities: Object[],
    ) => void,
    authorities: Object[],
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
                    setPropertyInfo,
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
                        highlightEnabled: false,
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
                    event.stopPropagation();
                    view.popup.close();

                    if (this.props.editMode === 'update') return;
                    view.hitTest(event).then((response) => {
                        const { results } = response;
                        const filteredResults = results.filter(item =>
                            item.graphic.id !== 'buffer'
                            && item.graphic.id !== 'drawMeasure'
                            && item.graphic.type !== 'draw-graphic');

                        if (this.props.activeTool !== 'drawErase') {
                            view.popup.open({ location: event.mapPoint });

                            const { activeAdminTool } = this.props;
                            mapSelectPopup(
                                filteredResults,
                                view,
                                selectFeatures,
                                layerList,
                                activeAdminTool,
                            );
                        }

                        if (results.length) {
                            if (this.props.activeTool === 'drawErase') {
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
                                const layer = filteredResults.find(l => l
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
                    const { x, y } = view.popup.location;
                    const { activeAdminTool, authorities } = this.props;
                    const layer = layerList.find((ll) => {
                        if (view.popup.viewModel &&
                            view.popup.viewModel.selectedFeature &&
                            view.popup.viewModel.selectedFeature.layer.id === ll.id) {
                            return true;
                        }
                        return false;
                    });

                    switch (evt.action.id) {
                        case 'select-intersect':
                            queryFeatures(
                                view.popup.viewModel.selectedFeature.geometry,
                                activeAdminTool,
                                view,
                                selectFeatures,
                                view.popup.viewModel.selectedFeature.layer.id,
                            );
                            break;
                        case 'set-buffer':
                            setSingleLayerGeometry(view.popup.viewModel.selectedFeature.geometry);
                            setActiveModal('bufferSelectedData');
                            break;
                        case 'get-property-info':
                            setPropertyInfo({ x, y }, view, 'propertyArea', authorities);
                            break;
                        case 'google-street-view':
                            getStreetViewLink(x, y);
                            break;
                        case 'case-management-link':
                            getCaseManagementLink(
                                layer,
                                view.popup.viewModel.selectedFeature.attributes,
                            );
                            break;
                        case 'alfresco-link':
                            getAlfrescoLink(
                                layer,
                                view.popup.viewModel.selectedFeature.attributes,
                            );
                            break;
                        default:
                            break;
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
                    addNonSpatialContentToTable,
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
                                addNonSpatialContentToTable,
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
