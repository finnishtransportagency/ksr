// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../translations';
import SelectToolWrapper from './styles';

type Props = {
    removeSelection: () => void,
    drawRectangleButtonRef: () => void,
    drawPolygonButtonRef: () => void,
    drawCircleButtonRef: () => void,
    toggleSelectToolsButtonRef: () => void,
    toggleTools: () => void,
    hasSelectedFeatures: boolean,
    isOpen: boolean,
    activeTool: string,
};

const SketchToolView = ({
    removeSelection,
    drawRectangleButtonRef,
    drawPolygonButtonRef,
    drawCircleButtonRef,
    toggleSelectToolsButtonRef,
    toggleTools,
    hasSelectedFeatures,
    isOpen,
    activeTool,
}: Props) => (
    <Fragment>
        <div id="select-tool-outer-wrapper" >
            <div
                style={{ visibility: hasSelectedFeatures ? 'visible' : 'hidden' }}
                id="remove-selection"
                role="button"
                tabIndex={0}
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.sketchTool.removeSelection}
                onClick={removeSelection}
                onKeyPress={removeSelection}
            >
                <span className="esri-icon-close" />
            </div>
            <SelectToolWrapper toggleTools={isOpen} id="select-tool-wrapper" >
                <div
                    id="draw-rectangle"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.sketchTool.drawRectangle}
                    ref={drawRectangleButtonRef}
                >
                    <span className="esri-icon-checkbox-unchecked" />
                </div>
                <div
                    id="draw-polygon-select"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.sketchTool.drawPolygonSelect}
                    ref={drawPolygonButtonRef}
                >
                    <span className="esri-icon-feature-layer" />
                </div>
                <div
                    id="draw-circle"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.sketchTool.drawCircle}
                    ref={drawCircleButtonRef}
                >
                    <span className="esri-icon-radio-unchecked" />
                </div>
            </SelectToolWrapper>
            <div
                id="toggle-select-tools"
                role="button"
                tabIndex={0}
                className={`esri-component esri-widget--button esri-widget esri-interactive ${activeTool ? 'disabled' : ''}`}
                title={strings.sketchTool.selectTool}
                ref={toggleSelectToolsButtonRef}
                onClick={() => { toggleTools(); }}
                onKeyPress={() => { toggleTools(); }}
            >
                <span className="esri-icon-navigation" />
            </div>
        </div>
    </Fragment>
);

export default SketchToolView;
