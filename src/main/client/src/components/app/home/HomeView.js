// @flow
import React, { Fragment } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InitMapContainer from '../map/InitMapContainer';
import ModalContainer from '../modal/ModalContainer';
import LoadingIcon from '../shared/LoadingIcon';
import SideBarContainer from '../side-bar/SideBarContainer';
import SideNavContainer from '../side-nav/SideNavContainer';
import TableContainer from '../table/TableContainer';
import { LoadingWrapper } from './styles';

type Props = {
    loadingWorkspace: boolean,
};

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

const HomeView = ({ loadingWorkspace }: Props) => (
    <Fragment>
        { loadingWorkspace &&
            <LoadingWrapper>
                <LoadingIcon size={20} loading={loadingWorkspace} />
            </LoadingWrapper>
        }
        <SideNavContainer />
        <SideBarContainer />
        <InitMapContainer />
        <TableContainer />
        <ModalContainer />
        <ToastContainer {...toastProps} />
    </Fragment>
);

export default HomeView;
