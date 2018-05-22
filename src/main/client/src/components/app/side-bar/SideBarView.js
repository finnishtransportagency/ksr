// @flow
import React from 'react';
import SideBar from '../../ui/blocks/SideBar';
import SearchView from './search/SearchView';

type Props = {
    activeNav: string,
};

const SideBarView = ({ activeNav }: Props) => (
    <SideBar active={activeNav}>
        {activeNav === 'search' && <SearchView />}
        {activeNav === 'mapLayers' && <h3>Karttatasot</h3>}
        {activeNav === 'fileExport' && <h3>Tiedostojen vienti</h3>}
    </SideBar>
);

export default SideBarView;
