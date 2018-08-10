// @flow
import React from 'react';
import LoadingIcon from '../shared/LoadingIcon';
import MapToolsContainer from './map-tools/MapToolsContainer';

import { Wrapper } from './styles';

type Props = {
    activeNav: string,
    view: any,
    isOpenTable: boolean,
};

const EsriMapView = ({ activeNav, view, isOpenTable }: Props) => (
    <Wrapper sideBar={activeNav === 'search' || activeNav === 'mapLayers'} tableOpen={isOpenTable} loading={!view.initialized}>
        <LoadingIcon loading={!view.initialized} />
        <div id="mapView">
            <MapToolsContainer view={view} />
        </div>
    </Wrapper>
);

export default EsriMapView;
