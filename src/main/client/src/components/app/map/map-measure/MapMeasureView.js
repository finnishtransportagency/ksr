// @flow
import React, { Fragment } from 'react';
import { MeasurementBox } from './styles';
import strings from '../../../../translations';

type Props = {
    value: string,
    active: string,
    removeMeasurement: () => void,
};

const MapMeasureView = ({ value, active, removeMeasurement }: Props) => (
    <Fragment>
        <div
            id="draw-polygon"
            className="esri-widget-button esri-widget esri-interactive"
            title={strings.mapMeasure.drawPolygon}
        >
            <span className="esri-icon-polygon" />
        </div>
        <div
            id="draw-line"
            className="esri-widget-button esri-widget esri-interactive"
            title={strings.mapMeasure.drawLine}
        >
            <span className="esri-icon-polyline" />
        </div>
        <MeasurementBox hidden={!active}>
            <div>
                <span className={`esri-icon-${active}`} />
            </div>
            <div>
                <span className="value-text">{value && value}</span>
            </div>
            <div
                tabIndex="0"
                role="button"
                onClick={removeMeasurement}
                onKeyPress={removeMeasurement}
            >
                <i className="fas fa-times" />
            </div>
        </MeasurementBox>
    </Fragment>
);

export default MapMeasureView;
