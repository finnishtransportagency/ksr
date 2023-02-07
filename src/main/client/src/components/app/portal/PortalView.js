// @flow
import React, { Fragment } from 'react';
import PortalWindowContainer from './portal-window/PortalWindowContainer';

type Props = {
    portalIsOpen: boolean,
}

function PortalView({ portalIsOpen }: Props): React$Element<React$FragmentType> {
    return (
        <>
            {portalIsOpen && <PortalWindowContainer />}
        </>
    );
}

export default PortalView;
