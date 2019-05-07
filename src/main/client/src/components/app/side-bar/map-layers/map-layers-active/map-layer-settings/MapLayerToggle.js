// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations';
import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerToggleIcon from './MapLayerToggleIcon';
import { layerViewable } from '../../../../../../utils/layers';

const getTitle = (layer: Object, mapScale: number) => {
    if (layer.minScale < mapScale && layer.minScale !== 0) {
        return strings.mapLayerSettings.zoomIn;
    } if (layer.maxScale > mapScale && layer.maxScale !== 0) {
        return strings.mapLayerSettings.zoomOut;
    }
    return strings.mapLayerSettings.toggleVisibility;
};

const getContent = (layer: Object, mapScale: number) => {
    if (!layerViewable(layer, mapScale)) {
        return <i className="fas fa-eye-slash" />;
    } if (layer.legendSymbol) {
        return (
            <Fragment>
                <div
                    className="symbolWrapper"
                    ref={(node) => {
                        if (node) {
                            node.innerHTML = '';
                            node.appendChild(layer.legendSymbol.cloneNode(true));
                        }
                    }}
                />
                <MapLayerToggleIcon visible={layer.visible} />
            </Fragment>
        );
    }
    return <MapLayerToggleIcon visible={layer.visible} />;
};

type Props = {
    layer: Object,
    mapScale: number,
    toggleLayer: (string) => void,
};

const MapLayerToggle = ({ layer, mapScale, toggleLayer }: Props) => (
    <LayerSettings.Toggle
        title={getTitle(layer, mapScale)}
        onClick={() => toggleLayer(layer.id)}
        viewable={layerViewable(layer, mapScale)}
    >
        { getContent(layer, mapScale) }
    </LayerSettings.Toggle>
);

export default MapLayerToggle;
