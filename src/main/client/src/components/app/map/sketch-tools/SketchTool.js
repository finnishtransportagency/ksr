// @flow
import esriLoader from 'esri-loader';
import React, { Component, createRef } from 'react';
import SketchToolView from './SketchToolView';
import * as styles from '../../../ui/defaultStyles';


type Props = {
    view: {},
    selectFeaturesFromArea: Function,
};

class SketchTool extends Component<Props> {
    constructor(props: Props) {
        super(props);
        (this: any).buttonVisibility = createRef();
        (this: any).drawRectangleButton = createRef();
        this.removeSelection = this.removeSelection.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        const { view, data } = newProps;

        if (view !== this.props.view) {
            this.sketchTool(view);
        }

        if (data.length > 0) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < data.length; i++) {
                if (data[i]._source === 'select') {
                    (this: any).buttonVisibility.current.style.visibility = 'visible';
                    break;
                }
            }
        } else {
            (this: any).buttonVisibility.current.style.visibility = 'hidden';
        }
    }

    sketchTool = (view: any) => {
        esriLoader
            .loadModules([
                'esri/widgets/Sketch/SketchViewModel',
            ])
            .then(([SketchViewModel]) => {
                const sketchViewModel = new SketchViewModel({
                    view,
                });

                const drawRectangleButton = (this: any).drawRectangleButton.current;
                drawRectangleButton.addEventListener('click', () => {
                    drawRectangleButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    sketchViewModel.create('rectangle');
                });

                const selectFeaturesFromDraw = (evt) => {
                    const { geometry } = evt;

                    const query = {
                        geometry,
                        outFields: ['*'],
                    };
                    view.map.layers.forEach((layer) => {
                        if (layer.queryFeatures) {
                            if (layer.visible) {
                                layer.queryFeatures(query).then((results) => {
                                    this.props.selectFeaturesFromArea(results);
                                });
                            }
                        }
                    });
                    drawRectangleButton.style.backgroundColor = styles.colorMain;
                    sketchViewModel.reset();
                };
                sketchViewModel.on('draw-complete', selectFeaturesFromDraw);
            });
    };

    removeSelection = () => {
        this.props.selectFeaturesFromArea([], 'remove');
    };

    render() {
        return (
            <SketchToolView
                removeSelection={this.removeSelection}
                buttonVisibilityRef={(this: any).buttonVisibility}
                drawRectangleButtonRef={(this: any).drawRectangleButton}
            />
        );
    }
}

export default SketchTool;
