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
    populateTable: (layer: Object) => void,
    loadingLayers: string[],
    toggleVisibleZoomOut: (layerId: string, original: number) => void,
    layersVisibleZoomOut: Object[],
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
    populateTable,
    loadingLayers,
    toggleVisibleZoomOut,
    layersVisibleZoomOut,
}: Props) => (
    <div>
        {!layer.parentLayer && (
            <LayerSettings
                toggledHidden={mapScale && (
                    !layerViewable(layer, mapScale)
                    && !layerList.filter(l => l.parentLayer === layer.id)
                        .some(l => (layersVisibleZoomOut || []).find(la => la.id === l.id))
                )}
            >
                <LayerSettings.Content>
                    <LayerSettings.ContentMain>
                        <LayerSettings.ContentTop>
                            <LayerSettings.Title title={layer.name ? layer.name : layer.title}>
                                <MapLayerTitle layer={layer} showLayerGroup />
                            </LayerSettings.Title>
                            {
                                ((nestedVal(
                                    layerList.find(l => l.id === layer.id.replace('_s', '')),
                                    ['active'],
                                )
                                    && (layer.layerPermission.createLayer
                                        || layer.layerPermission.updateLayer
                                        || layer.layerPermission.deleteLayer)))
                                && (
                                    <LayerSettings.Icons
                                        activeAdminTool={activeAdminTool === layer.id.replace('_s', '')}
                                    >
                                        <LayerSettings.Icon
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={() => handleAdminModeChange(layer.id.replace('_s', ''))}
                                            onClick={() => handleAdminModeChange(layer.id.replace('_s', ''))}
                                            className="fas fa-edit"
                                            title={strings.mapLayerSettings.toggleAdminTool}
                                        />
                                    </LayerSettings.Icons>
                                )
                            }
                        </LayerSettings.ContentTop>
                        {layerList.filter(l => l._source !== 'search' && l.parentLayer === layer.id)
                            .map(l => (
                                <MapLayerChildView
                                    key={l.id}
                                    layer={l}
                                    toggleLayer={toggleLayer}
                                    onOpacityChange={onOpacityChange}
                                    createThemeLayer={createThemeLayer}
                                    mapScale={mapScale}
                                    populateTable={populateTable}
                                    loadingLayers={loadingLayers}
                                    toggleVisibleZoomOut={toggleVisibleZoomOut}
                                    layersVisibleZoomOut={layersVisibleZoomOut}
                                />
                            ))}
                    </LayerSettings.ContentMain>
                </LayerSettings.Content>
            </LayerSettings>
        )}
    </div>
);

export default MapLayerParentChildView;
