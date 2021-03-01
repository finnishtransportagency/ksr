// @flow
import React, { Component, Fragment } from 'react';
import { loadModules } from 'esri-loader';
import SketchToolContainer from './sketch-tools/SketchToolContainer';
import MapDrawContainer from './map-draw/MapDrawContainer';

type Props = {
    view: Object,
    setMapTools: Function,
    tempGraphicsLayer: Object,
};

class MapTools extends Component<Props> {
    componentDidUpdate(prevProps: any) {
        const { view } = this.props;
        if (view !== prevProps.view) {
            this.mapTools();
        }
    }

    mapTools = () => {
        loadModules([
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
                    defaultUpdateOptions: {
                        tool: 'reshape',
                        toggleToolOnClick: false,
                    },
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
                <MapDrawContainer />
            </Fragment>
        );
    }
}

export default MapTools;
