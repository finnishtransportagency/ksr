// @flow
import esriLoader from 'esri-loader';
import React, { Component, createRef } from 'react';
import { resetMapTools } from '../../../../../utils/mapTools';
import * as styles from '../../../../ui/defaultStyles';
import SketchToolView from './SketchToolView';

type State = {
    isOpen: boolean,
};

const initialState = {
    isOpen: false,
};

type Props = {
    view: Object,
    draw: Object,
    sketchViewModel: Object,
    selectFeatures: Function,
    deSelectSelected: Function,
    active: string,
    setActiveTool: Function,
    data: Array<Object>,
    activeAdminTool: string,
};

class SketchTool extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };

        this.drawRectangleButton = createRef();
        this.drawPolygonButton = createRef();
        this.drawCircleButton = createRef();
        this.toggleSelectToolsButton = createRef();
        this.removeSelection = this.removeSelection.bind(this);
        this.toggleSelectTools = this.toggleSelectTools.bind(this);
    }

    componentWillReceiveProps(newProps: any) {
        const { sketchViewModel } = this.props;

        if (sketchViewModel !== newProps.sketchViewModel && newProps.sketchViewModel.initialized) {
            this.sketchTool();
        }
    }

    sketchTool = () => {
        esriLoader
            .loadModules([])
            .then(() => {
                const {
                    view, draw, sketchViewModel, setActiveTool,
                } = this.props;

                const drawRectangleButton = this.drawRectangleButton.current;
                const drawPolygonButton = this.drawPolygonButton.current;
                const drawCircleButton = this.drawCircleButton.current;

                drawRectangleButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchRectangle') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchRectangle');
                        sketchViewModel.create('rectangle');
                        drawRectangleButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawPolygonButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchPolygon') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchPolygon');
                        sketchViewModel.create('polygon');
                        drawPolygonButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                drawCircleButton.addEventListener('click', () => {
                    if (this.props.active === 'sketchCircle') {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                    } else {
                        resetMapTools(draw, sketchViewModel, setActiveTool);
                        setActiveTool('sketchCircle');
                        sketchViewModel.create('circle');
                        drawCircleButton.style.backgroundColor = styles.colorBackgroundDarkBlue;
                    }
                });

                const selectFeaturesFromDraw = (evt) => {
                    const { geometry } = evt;
                    const { activeAdminTool } = this.props;

                    const query = {
                        geometry,
                        outFields: ['*'],
                    };
                    const queries = [];
                    view.map.layers.forEach((layer) => {
                        if (layer.queryFeatures) {
                            if (layer.visible &&
                                !layer.definitionExpression &&
                                view.scale < layer.minScale &&
                                view.scale > layer.maxScale
                            ) {
                                if (activeAdminTool && activeAdminTool === layer.id) {
                                    queries.push(layer.queryFeatures(query).then(results => ({
                                        id: layer.id,
                                        title: layer.title,
                                        objectIdFieldName: layer.objectIdField,
                                        features: results.features,
                                        fields: layer.fields,
                                    })));
                                } else if (!activeAdminTool) {
                                    queries.push(layer.queryFeatures(query).then(results => ({
                                        id: layer.id,
                                        title: layer.title,
                                        objectIdFieldName: layer.objectIdField,
                                        features: results.features,
                                        fields: layer.fields,
                                    })));
                                }
                            }
                        }
                    });
                    Promise.all(queries).then(layers => this.props.selectFeatures({ layers }));

                    resetMapTools(draw, sketchViewModel, setActiveTool);
                    setActiveTool('');
                };

                sketchViewModel.on('create-complete', selectFeaturesFromDraw);
            });
    };

    removeSelection = () => {
        this.props.deSelectSelected();
    };

    toggleSelectTools = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    // Assign constructor ref flowtypes
    drawRectangleButton: any;
    drawPolygonButton: any;
    drawCircleButton: any;
    toggleSelectToolsButton: any;

    render() {
        const { data, view } = this.props;

        return (
            <SketchToolView
                removeSelection={this.removeSelection}
                drawRectangleButtonRef={this.drawRectangleButton}
                drawPolygonButtonRef={this.drawPolygonButton}
                drawCircleButtonRef={this.drawCircleButton}
                toggleSelectToolsButtonRef={this.toggleSelectToolsButton}
                toggleTools={this.toggleSelectTools}
                isOpen={this.state.isOpen}
                data={data}
                view={view}
            />
        );
    }
}

export default SketchTool;
