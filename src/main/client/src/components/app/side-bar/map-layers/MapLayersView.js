// @flow
import React, { Fragment } from 'react';
import MediaQuery from 'react-responsive';
import { Scrollbars } from 'react-custom-scrollbars';
import strings from '../../../../translations';
import SideBar from '../../../ui/blocks/SideBar';
import { H1, TextInput } from '../../../ui/elements';
import MapLayersActiveContainer from './map-layers-active/MapLayersActiveContainer';
import MapLayersAllContainer from './map-layers-all/MapLayersAllContainer';
import {
    ButtonLayerAddWrapper,
    ButtonLayerNav,
    ButtonLayerNavWrapper,
    LayerFilterWrapper,
    ToggleButton,
    ToggleButtonWrapper,
} from './styles';

type Props = {
    handleButtonClickLayers: (string) => void,
    activeTab: string,
    setActiveModal: (modal: string) => void,
    layerLegendActive: boolean,
    toggleLayerLegend: () => void,
    activeGroups: number[],
    activeSubGroups: number[],
    setActiveGroups: (activeGroups: number[]) => void,
    setActiveSubGroups: (activeSubGroups: number[]) => void,
    handleInputChange: (event: Object) => void,
    layersToFind: string,
    toggleIndexMap: Function,
    indexMapActive: boolean,
};

const MapLayersView = ({
    handleButtonClickLayers,
    activeTab,
    setActiveModal,
    layerLegendActive,
    toggleLayerLegend,
    activeGroups,
    activeSubGroups,
    setActiveGroups,
    setActiveSubGroups,
    handleInputChange,
    layersToFind,
    toggleIndexMap,
    indexMapActive,
}: Props) => (
    <Fragment>
        <SideBar.Header>
            <H1>{strings.mapLayers.title}</H1>
            <ToggleButtonWrapper>
                <ToggleButton
                    tabIndex="0"
                    role="button"
                    onClick={toggleIndexMap}
                    onKeyPress={toggleIndexMap}
                >

                    <span>{strings.mapLayers.toggleIndexMap}</span>
                    <i
                        className={
                            indexMapActive
                                ? 'fas fa-toggle-on'
                                : 'fas fa-toggle-off'
                        }
                    />
                </ToggleButton>
                <ToggleButton
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
                </ToggleButton>
            </ToggleButtonWrapper>

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
            {
                activeTab === 'all'
                && (
                    <LayerFilterWrapper>
                        <label htmlFor="filterAllLayers"> {/* eslint-disable-line */}
                            <span>{strings.mapLayers.filterAllLayers}</span>
                            <TextInput
                                backgroundDarker
                                type="text"
                                placeholder=""
                                id="filterAllLayers"
                                name="filterAllLayers"
                                autoComplete="off"
                                onChange={handleInputChange}
                                value={layersToFind}
                                maxLength={50}
                            />
                        </label>
                    </LayerFilterWrapper>
                )
            }
            <Scrollbars
                autoHide
                className={`layer-view-scroll-wrapper ${activeTab}`}
                renderView={scrollProps => <div {...scrollProps} className="layer-view-inner-scroll-wrapper" />}
                renderThumbVertical={scrollProps => <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
            >
                {
                    activeTab === 'all'
                    && (
                        <MapLayersAllContainer
                            layersToFind={layersToFind}
                            activeGroups={activeGroups}
                            activeSubGroups={activeSubGroups}
                            setActiveGroups={setActiveGroups}
                            setActiveSubGroups={setActiveSubGroups}
                        />
                    )
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
                        onClick={() => {
                            setActiveModal('shapefile');
                        }}
                    >
                        {strings.mapLayers.shape}
                    </ButtonLayerNav>
                </MediaQuery>
                <MediaQuery query="(max-width: 768px)">
                    <ButtonLayerNav
                        activeLayer={activeTab === 'shape'}
                        onClick={() => {
                            setActiveModal('shapefile');
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
