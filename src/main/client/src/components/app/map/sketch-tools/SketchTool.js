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
        this.buttonVisibility = createRef();
        this.drawRectangleButton = createRef();
        this.removeSelection = this.removeSelection.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        const { view, data } = newProps;

        if (view !== this.props.view) {
            this.sketchTool(view);
        }

        if (data.length > 0) {
            for (let i = 0; i < data.length; i += 1) {
                if (data[i]._source === 'select') {
                    this.buttonVisibility.current.style.visibility = 'visible';
                    break;
                }
            }
        } else {
            this.buttonVisibility.current.style.visibility = 'hidden';
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

                const drawRectangleButton = this.drawRectangleButton.current;
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

    // Assign constructor ref flowtypes
    buttonVisibility: any;
    drawRectangleButton: any;

    render() {
        return (
            <SketchToolView
                removeSelection={this.removeSelection}
                buttonVisibilityRef={this.buttonVisibility}
                drawRectangleButtonRef={this.drawRectangleButton}
            />
        );
    }
}

export default SketchTool;
