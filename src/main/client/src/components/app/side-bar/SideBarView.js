// @flow
import React from 'react';
import SideBar from '../../ui/blocks/SideBar';
import SearchContainer from './search/SearchContainer';
import MapLayersContainer from './map-layers/MapLayersContainer';
import WorkspaceContainer from './workspace/WorkspaceContainer';
import OfflineContainer from './offline/OfflineContainer';

type Props = {
    activeNav: string,
};

function SideBarView({ activeNav }: Props) {
    return (
        <SideBar active={
            activeNav === 'search'
            || activeNav === 'mapLayers'
            || activeNav === 'workspace'
            || activeNav === 'offline'
        }
        >
            {activeNav === 'search' && <SearchContainer />}
            {activeNav === 'mapLayers' && <MapLayersContainer />}
            {activeNav === 'workspace' && <WorkspaceContainer />}
            {activeNav === 'offline' && <OfflineContainer />}
        </SideBar>
    );
}

export default SideBarView;
