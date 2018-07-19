// @flow
import React, { Fragment } from 'react';
import { DrawToolOuterWrapper, DrawToolWrapper } from './styles';
import strings from '../../../../../translations';

type Props = {
    value: string,
    removeMeasurement: () => void,
    toggleDrawTools: Function,
    drawTools: boolean,
};

const MapMeasureView = ({
    value, removeMeasurement, toggleDrawTools, drawTools,
}: Props) => (
    <Fragment>
        <DrawToolOuterWrapper id="draw-tool-outer-wrapper">
            <div
                id="toggle-select-tools"
                role="button"
                tabIndex={0}
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.sketchTool.selectTool}
                onClick={() => { toggleDrawTools(); }}
                onKeyPress={() => { toggleDrawTools(); }}
            >
                <span className="esri-icon-edit" />
            </div>
            <DrawToolWrapper drawTools={drawTools}>
                <div
                    id="draw-polygon"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapMeasure.drawPolygon}
                >
                    <span className="esri-icon-polygon" />
                </div>
                <div
                    id="draw-line"
                    className="esri-component esri-widget--button esri-widget esri-interactive"
                    title={strings.mapMeasure.drawLine}
                >
                    <span className="esri-icon-polyline" />
                </div>
            </DrawToolWrapper>
            <div
                style={{ visibility: value ? 'visible' : 'hidden' }}
                id="remove-measurement"
                role="button"
                tabIndex={0}
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.sketchTool.removeSelection}
                onClick={removeMeasurement}
                onKeyPress={removeMeasurement}
            >
                <span className="esri-icon-close" />
            </div>
        </DrawToolOuterWrapper>
    </Fragment>
);

export default MapMeasureView;
