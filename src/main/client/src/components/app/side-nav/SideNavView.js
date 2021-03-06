// @flow
import React from 'react';
import SideNav from '../../ui/blocks/SideNav/index';
import strings from '../../../translations';

type Props = {
    setActiveNav: (string) => void,
    activeNav: string,
};

const SideNavView = ({ setActiveNav, activeNav }: Props) => (
    <SideNav>
        <SideNav.Logo onClick={() => { setActiveNav(''); }}>
            <img src="images/VAYLAwhite.png" alt="" />
        </SideNav.Logo>
        <SideNav.LinkWrapper>
            <div>
                <SideNav.Link
                    title={strings.sideNav.search}
                    active={activeNav === 'search'}
                    onClick={() => { setActiveNav('search'); }}
                >
                    <i className="fas fa-search" />
                </SideNav.Link>
                <SideNav.Link
                    title={strings.sideNav.layerManagement}
                    active={activeNav === 'mapLayers'}
                    onClick={() => { setActiveNav('mapLayers'); }}
                >
                    <i className="fas fa-layer-group" />
                </SideNav.Link>
                <SideNav.Link
                    title={strings.sideNav.fileExport}
                    active={activeNav === 'fileExport'}
                    onClick={() => { setActiveNav('fileExport'); }}
                >
                    <i className="fas fa-print" />
                </SideNav.Link>
                <SideNav.Link
                    title={strings.sideNav.workspace}
                    active={activeNav === 'workspace'}
                    onClick={() => { setActiveNav('workspace'); }}
                >
                    <i className="fas fa-briefcase" />
                </SideNav.Link>
                <SideNav.Link
                    title={strings.sideNav.offline}
                    active={activeNav === 'offline'}
                    onClick={() => { setActiveNav('offline'); }}
                >
                    <i className="fas fa-exchange-alt" />
                </SideNav.Link>
            </div>
        </SideNav.LinkWrapper>
    </SideNav>
);

export default SideNavView;
