// @flow
import React, { Fragment } from 'react';
import EsriMapContainer from '../map/EsriMapContainer';
import SideBarContainer from '../side-bar/SideBarContainer';
import SideNavContainer from '../side-nav/SideNavContainer';

const HomeView = () => (
    <Fragment>
        <SideNavContainer />
        <SideBarContainer />
        <EsriMapContainer />
    </Fragment>
);

export default HomeView;
