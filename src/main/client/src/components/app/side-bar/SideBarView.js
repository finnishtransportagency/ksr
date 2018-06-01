// @flow
import React from 'react';
import SideBar from '../../ui/blocks/SideBar';
import SearchView from './search/SearchView';
import MapLayersContainer from './map-layers/MapLayersContainer';

type Props = {
    activeNav: string,
};

const SideBarView = ({ activeNav }: Props) => (
    <SideBar active={activeNav}>
        {activeNav === 'search' && <SearchView />}
        {activeNav === 'mapLayers' && <MapLayersContainer />}
        {activeNav === 'fileExport' && <h3>Tiedostojen vienti</h3>}
    </SideBar>
);

export default SideBarView;
