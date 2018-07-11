// @flow
import esriLoader from 'esri-loader';
import React, { Component, createRef } from 'react';
import SketchToolView from './SketchToolView';
import * as styles from '../../../ui/defaultStyles';

type State = {
    isOpen: boolean,
};

const initialState = {
    isOpen: false,
};

type Props = {
    view: {},
    selectFeatures: Function,
    deSelectSelected: Function,
};

class SketchTool extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.buttonVisibility = createRef();
        this.drawRectangleButton = createRef();
        this.drawPolygonButton = createRef();
        this.drawCircleButton = createRef();
        this.toggleSelectToolsButton = createRef();
        this.removeSelection = this.removeSelection.bind(this);

        this.state = { ...initialState };
        this.toggleSelectTools = this.toggleSelectTools.bind(this);
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
                const drawPolygonButton = this.drawPolygonButton.current;
                const drawCircleButton = this.drawCircleButton.current;

                drawRectangleButton.addEventListener('click', () => {
                    drawRectangleButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    drawPolygonButton.style.backgroundColor = styles.colorMain;
                    drawCircleButton.style.backgroundColor = styles.colorMain;
                    sketchViewModel.create('rectangle');
                });

                drawPolygonButton.addEventListener('click', () => {
                    drawPolygonButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    drawRectangleButton.style.backgroundColor = styles.colorMain;
                    drawCircleButton.style.backgroundColor = styles.colorMain;
                    sketchViewModel.create('polygon');
                });

                drawCircleButton.addEventListener('click', () => {
                    drawCircleButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    drawRectangleButton.style.backgroundColor = styles.colorMain;
                    drawPolygonButton.style.backgroundColor = styles.colorMain;
                    sketchViewModel.create('circle');
                });

                const selectFeaturesFromDraw = (evt) => {
                    const { geometry } = evt;

                    const query = {
                        geometry,
                        outFields: ['*'],
                    };
                    const queries = [];
                    view.map.layers.forEach((layer) => {
                        if (layer.queryFeatures) {
                            if (layer.visible &&
                                view.scale < layer.minScale &&
                                view.scale > layer.maxScale
                            ) {
                                queries.push(layer.queryFeatures(query).then(results => ({
                                    id: layer.id,
                                    title: layer.title,
                                    objectIdFieldName: layer.objectIdField,
                                    features: results.features,
                                    fields: layer.fields,
                                })));
                            }
                        }
                    });
                    Promise.all(queries).then(layers => this.props.selectFeatures({ layers }));

                    drawRectangleButton.style.backgroundColor = styles.colorMain;
                    drawPolygonButton.style.backgroundColor = styles.colorMain;
                    drawCircleButton.style.backgroundColor = styles.colorMain;
                };

                sketchViewModel.on('draw-complete', selectFeaturesFromDraw);
            });
    };

    removeSelection = () => {
        this.props.deSelectSelected();
    };

    toggleSelectTools = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    // Assign constructor ref flowtypes
    buttonVisibility: any;
    drawRectangleButton: any;
    drawPolygonButton: any;
    drawCircleButton: any;
    toggleSelectToolsButton: any;

    render() {
        return (
            <SketchToolView
                removeSelection={this.removeSelection}
                buttonVisibilityRef={this.buttonVisibility}
                drawRectangleButtonRef={this.drawRectangleButton}
                drawPolygonButtonRef={this.drawPolygonButton}
                drawCircleButtonRef={this.drawCircleButton}
                toggleSelectToolsButtonRef={this.toggleSelectToolsButton}
                toggleTools={this.toggleSelectTools}
                isOpen={this.state.isOpen}
            />
        );
    }
}

export default SketchTool;
