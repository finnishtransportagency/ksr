// @flow
import React, { Fragment } from 'react';
import PortalWindowContainer from './portal-window/PortalWindowContainer';

type Props = {
    portalIsOpen: boolean,
}

const PortalView = ({ portalIsOpen }: Props) => (
    <Fragment>
        {portalIsOpen && <PortalWindowContainer />}
    </Fragment>
);

export default PortalView;
