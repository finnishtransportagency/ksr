// @flow
import React from 'react';
import 'rc-slider/assets/index.css';

import strings from '../../../../../../translations';

import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerTitle from '../../../../shared/MapLayerTitle';
import { layerViewable } from '../../../../../../utils/layers';
import { nestedVal } from '../../../../../../utils/nestedValue';
import MapLayerChildView from './MapLayerChildView';

type Props = {
    layer: Object,
    layerList: Object[],
    toggleLayer: (layerId: string) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    activeAdminTool: string,
    createThemeLayer: (layerId: string) => void,
    mapScale: number,
    handleAdminModeChange: (layerId: string) => void,
};

const MapLayerParentChildView = ({
    layer,
    layerList,
    onOpacityChange,
    toggleLayer,
    activeAdminTool,
    createThemeLayer,
    mapScale,
    handleAdminModeChange,
}: Props) => (
    <div>
        {!layer.parentLayer && (
            <LayerSettings
                toggledHidden={mapScale && !layerViewable(layer, mapScale)}
            >
                <LayerSettings.Content>
                    <LayerSettings.ContentMain>
                        <LayerSettings.ContentTop>
                            <LayerSettings.Title title={layer.name ? layer.name : layer.title}>
                                <MapLayerTitle layer={layer} showLayerGroup />
                            </LayerSettings.Title>
                            {
                                ((nestedVal(
                                    layerList.find(l => l.id === layer.id.replace('.s', '')),
                                    ['active'],
                                )
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
                        {layerList.filter(l => l._source !== 'search' && l.parentLayer === layer.id)
                            .sort((a, b) => b.layerOrder - a.layerOrder)
                            .map(l => (
                                <MapLayerChildView
                                    key={l.id}
                                    layer={l}
                                    toggleLayer={toggleLayer}
                                    onOpacityChange={onOpacityChange}
                                    createThemeLayer={createThemeLayer}
                                    mapScale={mapScale}
                                />
                            ))}
                    </LayerSettings.ContentMain>
                </LayerSettings.Content>
            </LayerSettings>
        )}
    </div>
);

export default MapLayerParentChildView;
