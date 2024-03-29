// @flow
import React, { Fragment } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toast } from '../../ui/elements/Toast';
import InitMapContainer from '../map/InitMapContainer';
import ModalContainer from '../modal/ModalContainer';
import LoadingIcon from '../shared/LoadingIcon';
import SideBarContainer from '../side-bar/SideBarContainer';
import SideNavContainer from '../side-nav/SideNavContainer';
import TableContainer from '../table/TableContainer';
import PortalContainer from '../portal/PortalContainer';
import { LoadingWrapper } from './styles';

type Props = {
    loading: boolean,
};

const toastProps = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    draggable: true,
    pauseOnHover: true,
    pauseOnVisibilityChange: true,
    rtl: false,
    transition: Slide,
    closeButton: false,
};

function HomeView({ loading }: Props): React$Element<React$FragmentType> {
    return (
        <>
            { loading && (
                <LoadingWrapper>
                    <LoadingIcon size={20} loading={loading} />
                </LoadingWrapper>
            )}
            <SideNavContainer />
            <SideBarContainer />
            <InitMapContainer />
            <TableContainer />
            <ModalContainer />
            <PortalContainer />
            <Toast>
                <ToastContainer {...toastProps} />
            </Toast>
        </>
    );
}

export default HomeView;
