// @flow
import React from 'react';
import SideBar from '../../ui/blocks/SideBar';
import SearchContainer from './search/SearchContainer';
import MapLayersContainer from './map-layers/MapLayersContainer';

type Props = {
    activeNav: string,
};

const SideBarView = ({ activeNav }: Props) => (
    <SideBar active={activeNav === 'search' || activeNav === 'mapLayers'}>
        {activeNav === 'search' && <SearchContainer />}
        {activeNav === 'mapLayers' && <MapLayersContainer />}
    </SideBar>
);

export default SideBarView;
