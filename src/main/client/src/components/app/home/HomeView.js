// @flow
import React, { Fragment } from 'react';
import EsriMapContainer from '../map/EsriMapContainer';
import ModalContainer from '../modal/ModalContainer';
import SideBarContainer from '../side-bar/SideBarContainer';
import SideNavContainer from '../side-nav/SideNavContainer';
import TableContainer from '../table/TableContainer';

const HomeView = () => (
    <Fragment>
        <SideNavContainer />
        <SideBarContainer />
        <EsriMapContainer />
        <TableContainer />
        <ModalContainer />
    </Fragment>
);

export default HomeView;
