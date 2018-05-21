// @flow
import React from 'react';
import SideNav from '../../../ui/blocks/SideNav';

type Props = {
    setActiveNav: (string) => void,
    navActive: {
        active: string,
    },
};

const SideNavView = ({ setActiveNav, navActive }: Props) => (
    <SideNav>
        <SideNav.Logo>
            <img src="https://www.liikennevirasto.fi/livi-theme/images/general/liikennevirasto_logo_2x.png" alt="" />
        </SideNav.Logo>
        <SideNav.LinkWrapper>
            <div>
                <SideNav.Link active={navActive && navActive.active === 'mapLayers'} onClick={() => { setActiveNav('mapLayers'); }}>
                    <i className="fas fa-map" />
                </SideNav.Link>
                <SideNav.Link active={navActive && navActive.active === 'fileExport'} onClick={() => { setActiveNav('fileExport'); }}>
                    <i className="fas fa-copy" />
                </SideNav.Link>
            </div>
            <div>
                <SideNav.Link>
                    <i className="fas fa-save" />
                </SideNav.Link>
            </div>
        </SideNav.LinkWrapper>

    </SideNav>
);

export default SideNavView;
