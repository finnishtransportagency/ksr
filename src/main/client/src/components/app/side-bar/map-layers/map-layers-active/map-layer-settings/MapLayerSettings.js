// @flow
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import strings from '../../../../../../translations';

import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerTitle from '../../../../shared/MapLayerTitle';
import LoadingIcon from '../../../../shared/LoadingIcon';
import MapLayerToggle from './MapLayerToggle';
import { layerViewable } from '../../../../../../utils/layers';
import { nestedVal } from '../../../../../../utils/nestedValue';
import { themeLayerFields } from '../../../../../../utils/fields';

type Props = {
    layer: Object,
    layerList: Object[],
    toggleLayer: (layerId: string) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
    createThemeLayer: (layerId: string) => void,
    mapScale: number,
    handleAdminModeChange: (layerId: string) => void,
    populateTable: (layer: Object) => void,
    loadingLayers: string[],
    toggleVisibleZoomOut: (layerId: string, original: number) => void,
    layersVisibleZoomOut: Object[],
};

const MapLayerSettings = ({
    layer,
    layerList,
    onOpacityChange,
    toggleLayer,
    activeAdminTool,
    createNonSpatialFeature,
    createThemeLayer,
    mapScale,
    handleAdminModeChange,
    populateTable,
    loadingLayers,
    toggleVisibleZoomOut,
    layersVisibleZoomOut,
}: Props) => (
    <LayerSettings
        toggledHidden={
            !layer.visible
            || (mapScale && !layerViewable(layer, mapScale))
        }
    >
        <LayerSettings.Content>
            {
                layer.type !== 'agfl'
                && (
                    <MapLayerToggle
                        layer={layer}
                        mapScale={mapScale}
                        toggleLayer={toggleLayer}
                        childLayer={false}
                        toggleVisibleZoomOut={toggleVisibleZoomOut}
                        layersViewableZoomOut={layersVisibleZoomOut}
                    />
                )
            }
            <LayerSettings.ContentMain>
                <LayerSettings.ContentTop>
                    <LayerSettings.Title title={layer.name ? layer.name : layer.title}>
                        <MapLayerTitle layer={layer} showLayerGroup />
                    </LayerSettings.Title>
                    {
                        <LayerSettings.Icons>
                            <LayerSettings.Loading>
                                {
                                    loadingLayers && loadingLayers.some(ll => ll === layer.id)
                                    && <LoadingIcon size={6} loading />
                                }
                            </LayerSettings.Loading>
                        </LayerSettings.Icons>
                    }
                    {
                        <LayerSettings.Icons>
                            <LayerSettings.Icon
                                hidden={activeAdminTool !== layer.id || (layer.type !== 'agfl' && !nestedVal(layer, ['propertyIdField'])) || !layer.layerPermission.createLayer}
                                className="fas fa-plus"
                                role="button"
                                tabIndex={0}
                                onKeyPress={() => createNonSpatialFeature()}
                                onClick={() => createNonSpatialFeature()}
                                title={strings.mapLayerSettings.addNewFeature}
                            />
                        </LayerSettings.Icons>
                    }
                    {
                        layer.type === 'agfs'
                        && layer._source !== 'search'
                        && layer._source !== 'shapefile'
                        && (
                            <LayerSettings.Icons>
                                <LayerSettings.Icon
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={() => populateTable(layer)}
                                    onClick={() => populateTable(layer)}
                                    className="fas fa-align-justify"
                                    title={strings.mapLayerSettings.showAllFeatures}
                                />
                            </LayerSettings.Icons>
                        )
                    }
                    {
                        layer.type === 'agfs'
                        && layer._source !== 'shapefile'
                        && themeLayerFields(layer).length > 0
                        && (
                            <LayerSettings.Icons>
                                <LayerSettings.Icon
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={() => createThemeLayer(layer.id)}
                                    onClick={() => createThemeLayer(layer.id)}
                                    className={`fas fa-palette ${layer.renderer ? 'theme-layer-created' : ''}`}
                                    title={strings.mapLayerSettings.createThemeLayer}
                                />
                            </LayerSettings.Icons>
                        )
                    }
                    {
                        ((!layer.userLayer
                        && layer._source !== 'shapefile'
                        && nestedVal(
                            layerList.find(l => l.id === layer.id.replace('.s', '')),
                            ['active'],
                        )
                        && !nestedVal(
                            layerList.find(l => l.id === layer.id.replace('.s', '')),
                            ['parentLayer'],
                        )
                        && (layer.type === 'agfs' || layer.type === 'agfl')
                        && (layer.layerPermission.createLayer
                            || layer.layerPermission.updateLayer
                            || layer.layerPermission.deleteLayer)))
                         && (
                             <LayerSettings.Icons
                                 activeAdminTool={activeAdminTool === layer.id.replace('.s', '')}
                             >
                                 <LayerSettings.Icon
                                     role="button"
                                     tabIndex={0}
                                     onKeyPress={() => handleAdminModeChange(layer.id.replace('.s', ''))}
                                     onClick={() => handleAdminModeChange(layer.id.replace('.s', ''))}
                                     className="fas fa-edit"
                                     title={strings.mapLayerSettings.toggleAdminTool}
                                 />
                             </LayerSettings.Icons>
                         )
                    }
                </LayerSettings.ContentTop>
                {
                    layer.type !== 'agfl'
                    && (
                        <LayerSettings.Slider>
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                defaultValue={layer.opacity}
                                onChange={evt => onOpacityChange(evt, layer.id)}
                            />
                        </LayerSettings.Slider>
                    )
                }
            </LayerSettings.ContentMain>
        </LayerSettings.Content>
    </LayerSettings>
);

export default MapLayerSettings;
