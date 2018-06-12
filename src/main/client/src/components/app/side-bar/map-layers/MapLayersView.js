// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import SideBar from '../../../ui/blocks/SideBar';
import { H1 } from '../../../ui/elements';
import MapLayersActiveContainer from './map-layers-active/MapLayersActiveContainer';
import MapLayersAllContainer from './map-layers-all/MapLayersAllContainer';
import { ButtonLayerNav } from './styles';

type Props = {
    handleButtonClickLayers: (string) => void,
    activeTab: string,
};

const MapLayersView = ({ handleButtonClickLayers, activeTab }: Props) => (
    <Fragment>
        <SideBar.Header>
            <H1>{strings.mapLayers.title}</H1>
        </SideBar.Header>
        <SideBar.Content>
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
            {activeTab === 'all' && <MapLayersAllContainer />}
            {activeTab === 'active' && <MapLayersActiveContainer />}
        </SideBar.Content>
    </Fragment>
);

export default MapLayersView;
