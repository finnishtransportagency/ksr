// @flow
import esriLoader from 'esri-loader';
import equals from 'nano-equal';

import React, { Component } from 'react';
import strings from '../../../translations';
import EsriMapView from './EsriMapView';

import { graphicsToEsriJSON } from '../../../utils/arcFormats';
import { getStreetViewLink } from '../../../utils/streetView';
import { addLayer, highlight, fitExtent } from '../../../utils/map';

import { MAP_VIEW_MAX_SCALE, MAP_VIEW_MIN_SCALE } from '../../../constants/common';

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

            // Update layer settings
            layerListReversed.forEach((l, i) => {
                // Add layer to map
                if (l.active && !view.map.findLayerById(l.id.toString())) {
                    l.visible = true;
                    addLayer(l, this.state.view, i);
                }

                // Change layer opacity and visibility
                view.map.allLayers.forEach((layer) => {
                    if (layer && l.id.toString() === layer.id) {
                        layer.visible = l.visible;
                        layer.opacity = l.opacity;
                        if (l.type === 'agfs') {
                            if (layer.definitionExpression !== l.definitionExpression) {
                                layer.definitionExpression = l.definitionExpression;
                                if (l._source === 'search') {
                                    fitExtent(layer, view);
                                }
                            }
                        }
                        if (!l.active) view.map.layers.remove(layer);
                    }
                });

                // Change layer order
                view.map.reorder(view.map.findLayerById(`${l.id}`, i));
            });
            view.map.allLayers.forEach((l) => {
                // Temporary fix for sketchViewModel index
                if (l.id.indexOf('layer') >= 0) view.map.reorder(view.map.findLayerById(`${l.id}`, view.map.allLayers.length));
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
                const { layerList, mapCenter, mapScale } = this.props;

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
                        maxScale: MAP_VIEW_MAX_SCALE,
                        minScale: MAP_VIEW_MIN_SCALE,
                    },
                });

                [...layerList].reverse().forEach((l, i) => {
                    addLayer(l, view, i);
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

                view.ui.move('zoom', 'top-right');
                view.ui.add(
                    [compass, locate, track, 'draw-polygon', 'draw-line', 'draw-rectangle', 'remove-selection'],
                    'top-right',
                );
                view.ui.add([scaleBar], 'bottom-left');

                view.on('click', (event) => {
                    if (event.button === 0) { // Should be primary click both on mouse and touch.
                        const swLink = getStreetViewLink(event.mapPoint.x, event.mapPoint.y);

                        view.popup.collapseEnabled = false;

                        const point = {
                            x: event.x,
                            y: event.y,
                        };

                        // Select features on point and add popup data to the layers
                        view.hitTest(point).then(({ results }) => {
                            const newResults = [...results];

                            results.forEach((layer, i) => {
                                const fieldInfos = [];

                                const queryColumns = this.props.layerList
                                    .filter(ll => ll.id.toString() === layer.graphic.layer.id)
                                    .map(ll => ll.queryColumns);

                                queryColumns[0].forEach((r) => {
                                    fieldInfos.push({
                                        fieldName: r,
                                        label: r,
                                    });
                                });

                                newResults[i].graphic.layer.popupTemplate = {
                                    title: layer.graphic.layer.title,
                                    content: [{
                                        type: 'text',
                                        text: swLink,
                                    }, {
                                        type: 'fields',
                                        fieldInfos,
                                    }],
                                };
                            });

                            const graphics = newResults.map(re => re.graphic);
                            const features = graphicsToEsriJSON(graphics);
                            this.props.selectFeatures(features);
                        });
                    }
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
