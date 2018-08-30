// @flow
import React, { Fragment } from 'react';
import { DrawToolOuterWrapper, DrawToolWrapper } from '../styles';
import strings from '../../../../../translations';

type Props = {
    hasGraphics: boolean,
    removeDrawings: () => void,
    toggleDrawTools: Function,
    drawTools: boolean,
};

const MapDrawView = ({
    hasGraphics, removeDrawings, toggleDrawTools, drawTools,
}: Props) => (
    <Fragment>
        <DrawToolOuterWrapper id="draw-tool-outer-wrapper">
            <div
                id="toggle-draw-tools"
                role="button"
                tabIndex={0}
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.mapDraw.selectTool}
                onClick={() => { toggleDrawTools(); }}
                onKeyPress={() => { toggleDrawTools(); }}
            >
                <span className="esri-icon-edit" />
            </div>
            <DrawToolWrapper drawTools={drawTools}>
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
