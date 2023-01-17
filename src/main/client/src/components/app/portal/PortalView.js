// @flow
import React, { Fragment } from 'react';
import PortalWindowContainer from './portal-window/PortalWindowContainer';

type Props = {
    portalIsOpen: boolean,
}

function PortalView({ portalIsOpen }: Props) {
    return (
        <>
            {portalIsOpen && <PortalWindowContainer />}
        </>
    );
}

export default PortalView;
