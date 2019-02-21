// @flow
import React, { Fragment } from 'react';
import MediaQuery from 'react-responsive';
import { Scrollbars } from 'react-custom-scrollbars';
import strings from '../../../../translations';
import SideBar from '../../../ui/blocks/SideBar';
import { H1 } from '../../../ui/elements';
import MapLayersActiveContainer from './map-layers-active/MapLayersActiveContainer';
import MapLayersAllContainer from './map-layers-all/MapLayersAllContainer';
import { ButtonLayerNav, ButtonLayerNavWrapper, ButtonLayerAddWrapper } from './styles';

type Props = {
    handleButtonClickLayers: (string) => void,
    activeTab: string,
    setActiveModal: (modal: string) => void,
    setDropzoneActive: () => void,
    layerLegendActive: boolean,
    toggleLayerLegend: () => void,
    activeGroups: number[],
    activeSubGroups: number[],
    setActiveGroups: (activeGroups: number[]) => void,
    setActiveSubGroups: (activeSubGroups: number[]) => void,
};

const MapLayersView = ({
    handleButtonClickLayers,
    activeTab,
    setActiveModal,
    setDropzoneActive,
    layerLegendActive,
    toggleLayerLegend,
    activeGroups,
    activeSubGroups,
    setActiveGroups,
    setActiveSubGroups,
}: Props) => (
    <Fragment>
        <SideBar.Header>
            <H1>{strings.mapLayers.title}</H1>
            <div
                className="toggle-button"
                tabIndex="0"
                role="button"
                onClick={toggleLayerLegend}
                onKeyPress={toggleLayerLegend}
            >
                <span>{strings.mapLayers.toggleLayerLegend}</span>
                <i
                    className={
                        layerLegendActive
                            ? 'fas fa-toggle-on'
                            : 'fas fa-toggle-off'
                    }
                />
            </div>
        </SideBar.Header>
        <SideBar.Content layerSettings={activeTab === 'active'}>
            <ButtonLayerNavWrapper>
                <ButtonLayerNav
                    flat
                    activeLayer={activeTab === 'active'}
                    onClick={() => handleButtonClickLayers('active')}
                >
                    {strings.mapLayers.active}
                </ButtonLayerNav>
                <ButtonLayerNav
                    flat
                    activeLayer={activeTab === 'all'}
                    onClick={() => handleButtonClickLayers('all')}
                >
                    {strings.mapLayers.all}
                </ButtonLayerNav>
            </ButtonLayerNavWrapper>
            <Scrollbars
                autoHide
                className="layer-view-scroll-wrapper"
                renderThumbVertical={scrollProps =>
                    <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
            >
                {
                    activeTab === 'all' &&
                    <MapLayersAllContainer
                        activeGroups={activeGroups}
                        activeSubGroups={activeSubGroups}
                        setActiveGroups={setActiveGroups}
                        setActiveSubGroups={setActiveSubGroups}
                    />
                }
                {activeTab === 'active' && <MapLayersActiveContainer />}
            </Scrollbars>
            <ButtonLayerAddWrapper>
                <ButtonLayerNav
                    tabIndex={0}
                    role="button"
                    onKeyPress={() => setActiveModal('addUserLayer')}
                    onClick={() => setActiveModal('addUserLayer')}
                >
                    {strings.mapLayers.addNewLayer}
                </ButtonLayerNav>
                <MediaQuery query="(min-width: 769px)">
                    <ButtonLayerNav
                        activeLayer={activeTab === 'shape'}
                        onClick={() => { setActiveModal('shapefile'); }}
                    >
                        {strings.mapLayers.shape}
                    </ButtonLayerNav>
                </MediaQuery>
                <MediaQuery query="(max-width: 768px)">
                    <ButtonLayerNav
                        activeLayer={activeTab === 'shape'}
                        onClick={() => {
                            setActiveModal('shapefile');
                            setDropzoneActive();
                        }}
                    >
                        {strings.mapLayers.shape}
                    </ButtonLayerNav>
                </MediaQuery>
            </ButtonLayerAddWrapper>
        </SideBar.Content>
    </Fragment>
);

export default MapLayersView;
