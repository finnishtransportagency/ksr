// @flow
import React, { Component, Fragment } from 'react';
import esriLoader from 'esri-loader';
import MapMeasureContainer from './map-measure/MapMeasureContainer';
import SketchToolContainer from './sketch-tools/SketchToolContainer';
import MapDrawContainer from './map-draw/MapDrawContainer';

type Props = {
    view: Object,
    setMapTools: Function,
    tempGraphicsLayer: Object,
};

class MapTools extends Component<Props> {
    componentWillReceiveProps(newProps: any) {
        if (this.props.view !== newProps.view && newProps.view._setup) {
            this.mapTools();
        }
    }

    mapTools = () => {
        esriLoader
            .loadModules([
                'esri/views/2d/draw/Draw',
                'esri/widgets/Sketch/SketchViewModel',
            ])
            .then(([Draw, SketchViewModel]) => {
                const { setMapTools, view, tempGraphicsLayer } = this.props;

                const draw = new Draw({
                    view,
                });

                const sketchViewModel = new SketchViewModel({
                    view,
                    layer: tempGraphicsLayer,
                });

                setMapTools(draw, sketchViewModel);
                return {
                    setMapTools, draw, sketchViewModel,
                };
            })
            .then(r => r.setMapTools(r.draw, r.sketchViewModel));
    };

    render() {
        return (
            <Fragment>
                <SketchToolContainer />
                <MapMeasureContainer />
                <MapDrawContainer />
            </Fragment>
        );
    }
}

export default MapTools;
