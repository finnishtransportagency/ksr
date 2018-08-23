// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import strings from '../../../../translations';
import SideBar from '../../../ui/blocks/SideBar';
import { H1 } from '../../../ui/elements';
import MapLayersActiveContainer from './map-layers-active/MapLayersActiveContainer';
import MapLayersAllContainer from './map-layers-all/MapLayersAllContainer';
import ModalAddUserLayer from './modal-add-user-layer/ModalAddUserLayer';
import { ButtonLayerNav, ButtonLayerNavWrapper, ButtonLayerAddWrapper } from './styles';

type Props = {
    handleButtonClickLayers: (string) => void,
    activeTab: string,
    activeModal: string,
    setActiveModal: Function,
};

const MapLayersView = ({
    handleButtonClickLayers, activeTab, activeModal, setActiveModal,
}: Props) => (
    <Fragment>
        <SideBar.Header>
            <H1>{strings.mapLayers.title}</H1>
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
                {activeTab === 'all' && <MapLayersAllContainer />}
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
                <ButtonLayerNav
                    disabled
                    tabIndex={0}
                    role="button"
                >Shape?
                </ButtonLayerNav>
            </ButtonLayerAddWrapper>
        </SideBar.Content>
        {activeModal === 'addUserLayer' && <ModalAddUserLayer />}
    </Fragment>
);

export default MapLayersView;
