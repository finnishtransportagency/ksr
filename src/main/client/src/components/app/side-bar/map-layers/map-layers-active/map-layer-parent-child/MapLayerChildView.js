// @flow
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import strings from '../../../../../../translations';

import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerTitle from '../../../../shared/MapLayerTitle';
import LoadingIcon from '../../../../shared/LoadingIcon';
import { layerViewable } from '../../../../../../utils/layers';
import MapLayerToggle from '../map-layer-settings/MapLayerToggle';
import { themeLayerFields } from '../../../../../../utils/fields';

type Props = {
    layer: Object,
    toggleLayer: (layerId: string) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    createThemeLayer: (layerId: string) => void,
    mapScale: number,
    populateTable: (layer: Object) => void,
    loadingLayers: string[],
    toggleVisibleZoomOut: (layerId: string, original: number) => void,
    layersVisibleZoomOut: Object[],
};

function MapLayerChildView({
    layer,
    toggleLayer,
    onOpacityChange,
    createThemeLayer,
    mapScale,
    populateTable,
    loadingLayers,
    toggleVisibleZoomOut,
    layersVisibleZoomOut,
}: Props) {
    const isLoading = loadingLayers && loadingLayers.some(ll => ll === layer.id);
    return (
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
                    toggleVisibleZoomOut={toggleVisibleZoomOut}
                    layersViewableZoomOut={layersVisibleZoomOut}
                />
                <LayerSettings.ContentMain childLayer>
                    <LayerSettings.ContentTop>
                        <LayerSettings.Title>
                            <MapLayerTitle layer={layer} childLayer />
                        </LayerSettings.Title>

                        <LayerSettings.Icons hidden={!isLoading}>
                            <LayerSettings.Loading>
                                {
                                    isLoading
                                  && <LoadingIcon size={6} loading />
                                }
                            </LayerSettings.Loading>
                        </LayerSettings.Icons>

                        {
                            layer.type === 'agfs'
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
                        <LayerSettings.Icons>
                            {themeLayerFields(layer).length > 0 && (
                                <LayerSettings.Icon
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={() => createThemeLayer(layer.id)}
                                    onClick={() => createThemeLayer(layer.id)}
                                    className={`fas fa-palette ${layer.renderer ? 'theme-layer-created' : ''}`}
                                    title={strings.mapLayerSettings.createThemeLayer}
                                />
                            )}
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
}

export default MapLayerChildView;
