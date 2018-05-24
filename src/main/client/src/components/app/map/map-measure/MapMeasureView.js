// @flow
import React, { Fragment } from 'react';

type Props = {
    value: string,
};

const MapMeasureView = ({ value }: Props) => (
    <Fragment>
        <div
            id="draw-polygon"
            className="esri-widget-button esri-widget esri-interactive"
            title="Draw and measure polygon"
        >
            <span className="esri-icon-polygon" />
        </div>
        <div
            id="draw-line"
            className="esri-widget-button esri-widget esri-interactive"
            title="Draw and measure line"
        >
            <span className="esri-icon-polyline" />
        </div>
        <div hidden={!value} id="measurement">
            {value}
        </div>
    </Fragment>
);

export default MapMeasureView;
