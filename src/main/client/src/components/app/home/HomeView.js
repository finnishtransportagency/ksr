// @flow
import React, { Fragment } from 'react';
import EsriMap from '../map/EsriMap';
import SideBarContainer from '../shared/SideBar/SideBarContainer';
import SideNavContainer from '../shared/SideNav/SideNavContainer';

const HomeView = () => (
    <Fragment>
        <SideNavContainer />
        <SideBarContainer />
        <EsriMap />
    </Fragment>
);

export default HomeView;
