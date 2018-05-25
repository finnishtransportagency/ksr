import React, { Fragment } from 'react';

const MapMeasureView = () => (
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
        <div id="measurement" />
    </Fragment>
);

export default MapMeasureView;
