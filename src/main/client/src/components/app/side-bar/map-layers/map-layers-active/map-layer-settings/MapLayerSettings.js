// @flow
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import strings from '../../../../../../translations';

import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerTitle from '../../../../shared/MapLayerTitle';

type Props = {
    layer: Object,
    layerList: Object[],
    onToggleVisibility: (Number) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
    createThemeLayer: (layerId: string) => void,
};

const MapLayerSettings = ({
    layer,
    layerList,
    onOpacityChange,
    onToggleVisibility,
    setActiveAdminTool,
    activeAdminTool,
    createNonSpatialFeature,
    createThemeLayer,
}: Props) => (
    <LayerSettings
        toggledHidden={!layer.visible}
    >
        <LayerSettings.Content>
            {
                layer.type !== 'agfl' &&
                <LayerSettings.Toggle onClick={() => onToggleVisibility(layer.id)}>
                    <i
                        className={layer.visible ? 'fas fa-toggle-on' : 'fas fa-toggle-off'}
                        title={strings.mapLayerSettings.toggleVisibility}
                    />
                </LayerSettings.Toggle>
            }
            <LayerSettings.ContentMain>
                <LayerSettings.ContentTop>
                    <LayerSettings.Title title={layer.name ? layer.name : layer.title}>
                        <MapLayerTitle layer={layer} />
                    </LayerSettings.Title>
                    {
                        activeAdminTool === layer.id && layer.type === 'agfl' && layer.layerPermission.createLayer &&
                        <LayerSettings.Icons>
                            <i
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
                        layer.type === 'agfs' &&
                        <LayerSettings.Icons>
                            <i
                                role="button"
                                tabIndex={0}
                                onKeyPress={() => createThemeLayer(layer.id)}
                                onClick={() => createThemeLayer(layer.id)}
                                className={`fas fa-palette ${layer.renderer ? 'theme-layer-created' : ''}`}
                                title={strings.mapLayerSettings.createThemeLayer}
                            />
                        </LayerSettings.Icons>
                    }
                    {
                        layer._source !== 'search'
                        && !layer.userLayer
                        && layer._source !== 'shapefile'
                        && (layer.type === 'agfs' || layer.type === 'agfl')
                        && (layer.layerPermission.createLayer
                            || layer.layerPermission.updateLayer
                            || layer.layerPermission.deleteLayer) &&
                        <LayerSettings.Icons activeAdminTool={activeAdminTool === layer.id}>
                            <i
                                role="button"
                                tabIndex={0}
                                onKeyPress={() => setActiveAdminTool(layer.id, layerList)}
                                onClick={() => setActiveAdminTool(layer.id, layerList)}
                                className="fas fa-edit"
                                title={strings.mapLayerSettings.toggleAdminTool}
                            />
                        </LayerSettings.Icons>
                    }
                </LayerSettings.ContentTop>
                {
                    layer.type !== 'agfl' &&
                    <LayerSettings.Slider>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            defaultValue={layer.opacity}
                            onChange={evt => onOpacityChange(evt, layer.id)}
                        />
                    </LayerSettings.Slider>
                }
            </LayerSettings.ContentMain>
        </LayerSettings.Content>
    </LayerSettings>
);

export default MapLayerSettings;
