// @flow
import esriLoader from 'esri-loader';
import equals from 'nano-equal';

import React, { Component } from 'react';
import { mapSelectPopup } from '../../../utils/map-selection/mapSelectPopup';
import EsriMapView from './EsriMapView';
import { addLayers, highlight, fitExtent } from '../../../utils/map';

type Props = {
    activeNav: string,
    layerList: Array<any>,
    fetching: boolean,
    isOpenTable: boolean,
    mapCenter: Array<number>,
    mapScale: number,
    selectFeatures: Function,
    selectedFeatures: Array<Object>
};

type State = {
    options: {
        container: string,
    },
    view: any,
};

const initialState = {
    options: {
        container: 'mapView',
    },
    view: null,
};

class EsriMap extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { ...initialState };
    }

    componentDidUpdate(prevProps: Props) {
        const { fetching, layerList } = this.props;
        const { view } = this.state;

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
                addLayers(newLayers, this.state.view, searchLayers);
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

        if (!equals(prevProps.selectedFeatures, this.props.selectedFeatures)) {
            highlight(view, this.props.selectedFeatures);
        }
    }

    initMap = () => {
        esriLoader.loadCss('https://js.arcgis.com/4.7/esri/css/main.css');

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
            ]) => {
                const { container } = this.state.options;
                const {
                    layerList, mapCenter, mapScale, selectFeatures,
                } = this.props;

                const map = new Map({
                    layers: [],
                });

                const epsg3067 = new SpatialReference(3067);

                const center = new Point({
                    x: mapCenter[0],
                    y: mapCenter[1],
                    spatialReference: epsg3067,
                });

                const view = new MapView({
                    container,
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

                view.ui.move('zoom', 'top-right');
                view.ui.add(
                    [
                        compass,
                        locate,
                        track,
                        'draw-polygon',
                        'draw-line',
                        'select-tool-outer-wrapper',
                    ],
                    'top-right',
                );
                view.ui.add([scaleBar], 'bottom-left');

                (document.getElementById: Function)('select-tool-outer-wrapper').classList
                    .remove('esri-component');

                view.on('click', (event) => {
                    mapSelectPopup(event, view, selectFeatures, layerList);
                });

                this.setState({ view });
            });
    };

    render() {
        const { activeNav, isOpenTable } = this.props;
        const { view } = this.state;

        return <EsriMapView activeNav={activeNav} isOpenTable={isOpenTable} view={view} />;
    }
}

export default EsriMap;
