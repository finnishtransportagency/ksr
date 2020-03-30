// @flow
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import strings from '../../../../../../translations';

import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerTitle from '../../../../shared/MapLayerTitle';
import MapLayerToggle from './MapLayerToggle';
import { layerViewable } from '../../../../../../utils/layers';
import { nestedVal } from '../../../../../../utils/nestedValue';

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
                        && layer._source !== 'shapefile'
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
                        !layer.userLayer
                        && layer._source !== 'shapefile'
                        && nestedVal(
                            layerList.find(l => l.id === layer.id.replace('.s', '')),
                            ['active'],
                        )
                        && (layer.type === 'agfs' || layer.type === 'agfl')
                        && (layer.layerPermission.createLayer
                            || layer.layerPermission.updateLayer
                            || layer.layerPermission.deleteLayer)
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
