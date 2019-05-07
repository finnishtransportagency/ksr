// @flow
import React, { Fragment } from 'react';
import { DrawToolOuterWrapper, DrawToolWrapper } from '../styles';
import strings from '../../../../../translations';

type Props = {
    hasGraphics: boolean,
    removeDrawings: () => void,
    toggleDrawTools: Function,
    isActive: boolean,
    showMeasurements: boolean,
    activeTool: string,
};

const MapDrawView = ({
    hasGraphics, removeDrawings, toggleDrawTools, isActive, showMeasurements, activeTool,
}: Props) => (
    <Fragment>
        <DrawToolOuterWrapper id="draw-tool-outer-wrapper">
            <div
                id="toggle-draw-tools"
                role="button"
                tabIndex={0}
                className={`esri-component esri-widget--button esri-widget esri-interactive ${activeTool ? 'disabled' : ''}`}
                title={strings.mapDraw.selectTool}
                onClick={() => { toggleDrawTools(); }}
                onKeyPress={() => { toggleDrawTools(); }}
            >
                <span className="esri-icon-edit" />
            </div>
            <DrawToolWrapper drawTools={isActive} showMeasurements={showMeasurements}>
                <div
                    id="toggle-measurements"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapDraw.toggleMeasurements}
                >
                    <span className="esri-icon-line-chart" />
                </div>
                <div
                    id="draw-erase"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapDraw.drawErase}
                >
                    <span className="esri-icon-erase" />
                </div>
                <div
                    id="draw-polygon"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapDraw.drawPolygon}
                >
                    <span className="esri-icon-polygon" />
                </div>
                <div
                    id="draw-line"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapDraw.drawLine}
                >
                    <span className="esri-icon-polyline" />
                </div>
                <div
                    id="draw-point"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapDraw.drawPoint}
                >
                    <span className="esri-icon-map-pin" />
                </div>
                <div
                    id="draw-text"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapDraw.drawText}
                >
                    <span className="esri-icon-comment" />
                </div>
            </DrawToolWrapper>
            <div
                style={{ visibility: hasGraphics ? 'visible' : 'hidden' }}
                id="remove-draw"
                role="button"
                tabIndex={0}
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.mapDraw.removeDraw}
                onClick={removeDrawings}
                onKeyPress={removeDrawings}
            >
                <span className="esri-icon-close" />
            </div>
        </DrawToolOuterWrapper>
    </Fragment>
);

export default MapDrawView;
