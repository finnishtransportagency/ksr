// @flow
import React from 'react';
import SideNav from '../../ui/blocks/SideNav/index';
import strings from '../../../translations';
import SideBarSubContainer from '../side-bar/SideBarSubContainer';
import HelpModalContainer from '../side-bar/helpmodal/HelpModalContainer';
import HelpModal from '../side-bar/helpmodal/HelpModal';
import CloseButtonContainer from '../side-bar/helpmodal/CloseButtonContainer';

type Props = {
    setActiveNav: (string) => void,
    activeNav: string,
};

const SideNavView = ({ setActiveNav, activeNav }: Props) => (
    <React.Fragment>
        <SideNav>
            <SideNav.Logo onClick={() => { setActiveNav(''); }}>
                <img src="images/VAYLAwhite.png" alt="" />
            </SideNav.Logo>
            <SideNav.LinkWrapper>
                <SideBarSubContainer>
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
                    <div style={{
                        display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'end',
                    }}
                    >
                        <SideNav.Link
                            title={strings.helpModal.hoverTitle}
                            active={activeNav === 'help'}
                            onClick={() => {
                                setActiveNav('help');
                            }}
                        >
                            <i className="fas fa-question" />
                        </SideNav.Link>
                    </div>

                </SideBarSubContainer>

            </SideNav.LinkWrapper>
        </SideNav>
        {activeNav === 'help'

          && (
              <HelpModalContainer>
                  <HelpModal>
                      {strings.helpModal.text}
                      {' '}
                      <a href={`mailto:${strings.helpModal.email}`}>{strings.helpModal.email}</a>
                      <CloseButtonContainer onClick={() => setActiveNav('')}>
                          <i className="far fa-window-close" />
                      </CloseButtonContainer>
                  </HelpModal>
              </HelpModalContainer>
          )
        }
    </React.Fragment>
);

export default SideNavView;
