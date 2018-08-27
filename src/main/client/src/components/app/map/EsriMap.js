// @flow
import esriLoader from 'esri-loader';
import equals from 'nano-equal';

import React, { Component } from 'react';
import { mapSelectPopup } from '../../../utils/map-selection/mapSelectPopup';
import EsriMapView from './EsriMapView';
import { addLayers, highlight, fitExtent } from '../../../utils/map';
import { setBuffer } from '../../../utils/buffer';

type Props = {
    view: Object,
    activeNav: string,
    layerList: Array<any>,
    fetching: boolean,
    isOpenTable: boolean,
    mapCenter: Array<number>,
    mapScale: number,
    printServiceUrl: ?string,
    selectFeatures: Function,
    selectedFeatures: Array<Object>,
    setMapView: (view: Object) => void,
    adminToolActive: string,
    sketchViewModel: Object,
    setEditMode: (editMode: string) => void,
    editMode: string,
    setTempGrapLayer: (graphicsLayer: Object) => void,
    layers: Array<Object>,
    setActiveModal: Function,
    setSingleLayerGeometry: Function,
};

class EsriMap extends Component<Props> {
    printWidget: ?Object = null; // eslint-disable-line react/sort-comp

    componentDidUpdate(prevProps: Props) {
        const {
            fetching, layerList, view, activeNav,
        } = this.props;

        if (prevProps.fetching !== fetching) {
            this.initMap();
        }

        if (
            prevProps.layerList.length > 0 &&
            prevProps.layerList !== layerList &&
            view && view.map
        ) {
            const layerListReversed = [...layerList].reverse();
            const searchLayers = [];
            const newLayers = [];

            // Update layer settings
            layerListReversed.forEach((l, i) => {
                // Change layer opacity and visibility
                view.map.allLayers.forEach((layer) => {
                    if (layer && l.id === layer.id) {
                        layer.visible = l.visible;
                        layer.opacity = l.opacity;
                        if (l.type === 'agfs') {
                            if (layer.definitionExpression !== l.definitionExpression) {
                                layer.definitionExpression = l.definitionExpression;
                                if (l._source === 'search') {
                                    searchLayers.push(layer);
                                }
                            }
                        }
                        if (!l.active) view.map.layers.remove(layer);
                    }
                });

                if (l.active && !view.map.findLayerById(l.id)) {
                    l.visible = true;
                    l.index = i;
                    newLayers.push(l);
                }

                // Change layer order
                view.map.reorder(view.map.findLayerById(`${l.id}`, i));
            });

            if (newLayers.length) {
                // Add new layers to map
                addLayers(newLayers, view, searchLayers);
            } else if (searchLayers.length) {
                fitExtent(searchLayers, view);
            }

            view.map.allLayers.forEach((l) => {
                // Temporary fix for sketchViewModel index
                if (l.id.indexOf('layer') >= 0) {
                    view.map.reorder(view.map.findLayerById(`${l.id}`, view.map.allLayers.length));
                }
            });
        }

        if (activeNav !== prevProps.activeNav && this.printWidget) {
            if (activeNav === 'fileExport') {
                view.ui.add(this.printWidget, 'top-left');
            } else {
                view.ui.remove(this.printWidget);
            }
        }

        if (!equals(prevProps.selectedFeatures, this.props.selectedFeatures)) {
            highlight(view, this.props.selectedFeatures);
        }
        if (this.props.layers.length < 1 && view) {
            setBuffer(view, [], 0);
        }
    }

    initMap = () => {
        esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css');

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
                    setMapView,
                    selectFeatures,
                    printServiceUrl,
                    activeNav,
                    setTempGrapLayer,
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
                });

                const layers = [...layerList].reverse().map((l, index) => ({ ...l, index }));
                addLayers(layers, view, []);

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
                        'draw-tool-outer-wrapper',
                        'select-tool-outer-wrapper',
                        'create-new-feature-wrapper',
                    ],
                    'top-right',
                );
                view.ui.add([scaleBar], 'bottom-left');

                if (activeNav === 'fileExport') {
                    view.ui.add(this.printWidget, 'top-left');
                }

                (document.getElementById: Function)('select-tool-outer-wrapper').classList
                    .remove('esri-component');

                (document.getElementById: Function)('draw-tool-outer-wrapper').classList
                    .remove('esri-component');

                (document.getElementById: Function)('create-new-feature-wrapper').classList
                    .remove('esri-component');

                view.on('click', (event) => {
                    // Return if update sketch is ongoing
                    if (this.props.editMode === 'update') return;
                    view.hitTest(event).then((response) => {
                        const { results } = response;
                        // Found results
                        if (results.length) {
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
                            } else {
                                const { adminToolActive } = this.props;
                                mapSelectPopup(
                                    event,
                                    view,
                                    selectFeatures,
                                    layerList,
                                    adminToolActive,
                                    setActiveModal,
                                    setSingleLayerGeometry,
                                );
                            }
                        }
                    });
                });

                return {
                    setMapView, view, setTempGrapLayer, tempGraphicsLayer,
                };
            })
            .then((r) => {
                r.setMapView(r.view);
                r.setTempGrapLayer(r.tempGraphicsLayer);
            });
    };

    render() {
        const { activeNav, isOpenTable, view } = this.props;

        return <EsriMapView activeNav={activeNav} isOpenTable={isOpenTable} view={view} />;
    }
}

export default EsriMap;
