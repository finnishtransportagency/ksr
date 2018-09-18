// @flow
import React, { Fragment } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EsriMapContainer from '../map/EsriMapContainer';
import ModalContainer from '../modal/ModalContainer';
import SideBarContainer from '../side-bar/SideBarContainer';
import SideNavContainer from '../side-nav/SideNavContainer';
import TableContainer from '../table/TableContainer';

const toastProps = {
    position: 'bottom-right',
    autoClose: 8000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    draggable: true,
    pauseOnHover: true,
    pauseOnVisibilityChange: true,
    rtl: false,
    transition: Slide,
};

const HomeView = () => (
    <Fragment>
        <SideNavContainer />
        <SideBarContainer />
        <EsriMapContainer />
        <TableContainer />
        <ModalContainer />
        <ToastContainer {...toastProps} />
    </Fragment>
);

export default HomeView;
