// @flow
import React from 'react';
import MapMeasure from './map-measure/MapMeasure';
import { Wrapper } from './styles';

type Props = {
    activeNav: string,
    view: any,
};

const EsriMapView = ({ activeNav, view }: Props) => (
    <Wrapper sideBar={activeNav}>
        <div id="mapView">
            <MapMeasure view={view} />
        </div>
    </Wrapper>
);

export default EsriMapView;
