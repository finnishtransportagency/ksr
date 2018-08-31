// @flow
import React from 'react';
import SideBar from '../../ui/blocks/SideBar';
import SearchContainer from './search/SearchContainer';
import MapLayersContainer from './map-layers/MapLayersContainer';
import WorkspaceContainer from './workspace/WorkspaceContainer';

type Props = {
    activeNav: string,
};

const SideBarView = ({ activeNav }: Props) => (
    <SideBar active={activeNav === 'search' || activeNav === 'mapLayers' || activeNav === 'workspace'}>
        {activeNav === 'search' && <SearchContainer />}
        {activeNav === 'mapLayers' && <MapLayersContainer />}
        {activeNav === 'workspace' && <WorkspaceContainer />}
    </SideBar>
);

export default SideBarView;
