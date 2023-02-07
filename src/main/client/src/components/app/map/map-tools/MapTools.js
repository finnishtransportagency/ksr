// @flow
import React, { Component, Fragment } from 'react';
// import { loadModules } from 'esri-loader';
import Draw from '@arcgis/core/views/draw/Draw';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SketchToolContainer from './sketch-tools/SketchToolContainer';
import MapDrawContainer from './map-draw/MapDrawContainer';

type Props = {
    view: Object,
    setMapTools: Function,
    tempGraphicsLayer: Object,
    viewLayersCount: Object,
    setSnappingFeatureSources: Function,
};

let mapToolsInitialized = false;

class MapTools extends Component<Props> {
    componentDidUpdate(prevProps: any) {
        const {
            view, viewLayersCount, setSnappingFeatureSources, tempGraphicsLayer,
        } = this.props;
        if ((tempGraphicsLayer && !mapToolsInitialized) || (tempGraphicsLayer && view !== prevProps.view)) {
            mapToolsInitialized = true;
            this.mapTools(tempGraphicsLayer);
        }

        if (viewLayersCount !== prevProps.viewLayersCount) {
            setSnappingFeatureSources(this.getSnappingFeatureSourcesFromView(view));
        }
    }

    getSnappingFeatureSourcesFromView: ((view: any) => Array<any | { layer: any, ... }>) = (view: Object) => {
        const featureSources = [];
        view.map.allLayers.forEach((layer) => {
            if (!['wmts', 'wms'].includes(layer.type)) {
                featureSources.push({
                    layer,
                });
            }
        });
        return featureSources;
    };

    mapTools: ((tempGraphicsLayer?: Object) => void) = (tempGraphicsLayer) => {
        const { setMapTools, view } = this.props;

        const draw = new Draw({
            view,
        });

        const featureSources = this.getSnappingFeatureSourcesFromView(view);

        const sketchViewModel = new SketchViewModel({
            view,
            layer: tempGraphicsLayer,
            defaultUpdateOptions: {
                tool: 'reshape',
                toggleToolOnClick: false,
            },
            snappingOptions: {
                enabled: true,
                distance: 15,
                featureSources,
            },
        });

        setMapTools(draw, sketchViewModel);
    };

    render(): React$Element<React$FragmentType> {
        return (
            <>
                <SketchToolContainer />
                <MapDrawContainer />
            </>
        );
    }
}

export default MapTools;
