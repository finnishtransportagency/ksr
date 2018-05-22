// @flow
import React from 'react';
import SideBar from '../../ui/blocks/SideBar';
import SearchView from './search/SearchView';

type Props = {
    activeNav: string,
};

const SideBarView = ({ activeNav }: Props) => (
    <SideBar active={activeNav}>
        <SideBar.Content>
            {activeNav === 'search' && <SearchView />}
        </SideBar.Content>
    </SideBar>
);

export default SideBarView;
