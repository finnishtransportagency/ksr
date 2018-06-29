// @flow
import React from 'react';
import MapMeasure from './map-measure/MapMeasure';
import SketchToolContainer from './sketch-tools/SketchToolContainer';

import { Wrapper } from './styles';

type Props = {
    activeNav: string,
    view: any,
    isOpenTable: boolean,
};

const EsriMapView = ({ activeNav, view, isOpenTable }: Props) => (
    <Wrapper sideBar={activeNav} toggleTable={isOpenTable}>
        <div id="mapView">
            <MapMeasure view={view} />
            <SketchToolContainer view={view} />
        </div>
    </Wrapper>
);

export default EsriMapView;
