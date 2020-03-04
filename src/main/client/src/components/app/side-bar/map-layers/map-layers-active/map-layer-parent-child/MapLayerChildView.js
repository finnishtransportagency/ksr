// @flow
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import strings from '../../../../../../translations';

import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerTitle from '../../../../shared/MapLayerTitle';
import { layerViewable } from '../../../../../../utils/layers';
import MapLayerToggle from '../map-layer-settings/MapLayerToggle';

type Props = {
    layer: Object,
    toggleLayer: (layerId: string) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    createThemeLayer: (layerId: string) => void,
    mapScale: number,
};

const MapLayerChildView = ({
    layer,
    toggleLayer,
    onOpacityChange,
    createThemeLayer,
    mapScale,
}: Props) => (
    <LayerSettings
        childLayer
        toggledHidden={
            !layer.visible
            || (mapScale && !layerViewable(layer, mapScale))
        }
    >
        <LayerSettings.Content childLayer>
            <MapLayerToggle
                layer={layer}
                mapScale={mapScale}
                toggleLayer={toggleLayer}
                childLayer
            />
            <LayerSettings.ContentMain childLayer>
                <LayerSettings.ContentTop>
                    <LayerSettings.Title title={layer.name ? layer.name : layer.title}>
                        <MapLayerTitle layer={layer} childLayer />
                    </LayerSettings.Title>
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
                </LayerSettings.ContentTop>
                <LayerSettings.Slider>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        defaultValue={layer.opacity}
                        onChange={evt => onOpacityChange(evt, layer.id)}
                    />
                </LayerSettings.Slider>
            </LayerSettings.ContentMain>
        </LayerSettings.Content>
    </LayerSettings>
);

export default MapLayerChildView;