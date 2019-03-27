// @flow
import React from 'react';
import LoadingIcon from '../../shared/LoadingIcon';
import MapToolsContainer from '../map-tools/MapToolsContainer';

import { Wrapper } from './styles';
import BaseMapSwitchContainer from '../base-map-switch/BaseMapSwitchContainer';

type Props = {
    activeNav: string,
    view: any,
    isOpenTable: boolean,
    adminToolActive: boolean,
    layerLegendActive: boolean,
};

const EsriMapView = ({
    activeNav,
    view,
    isOpenTable,
    adminToolActive,
    layerLegendActive,
}: Props) => (
    <Wrapper
        sideBar={activeNav === 'search' || activeNav === 'mapLayers' || activeNav === 'workspace' || activeNav === 'offline'}
        tableOpen={isOpenTable}
        adminToolActive={adminToolActive}
        loading={!view}
        layerLegendActive={layerLegendActive}
    >
        <LoadingIcon size={0} loading={!view} />
        <div id="mapView">
            <MapToolsContainer view={view} />
        </div>
        <BaseMapSwitchContainer />
    </Wrapper>
);

export default EsriMapView;
