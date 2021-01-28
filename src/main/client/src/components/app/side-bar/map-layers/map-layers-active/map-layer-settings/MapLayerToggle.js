// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations';
import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerToggleIcon from './MapLayerToggleIcon';
import { layerViewable } from '../../../../../../utils/layers';

type Props = {
    layer: Object,
    mapScale: number,
    toggleLayer: (string) => void,
    childLayer: boolean,
    toggleVisibleZoomOut: (string, number) => void,
    layersViewableZoomOut: Object[],
};

const MapLayerToggle = ({
    layer, mapScale, toggleLayer, childLayer, toggleVisibleZoomOut, layersViewableZoomOut,
}: Props) => {
    const matching = layersViewableZoomOut !== undefined
        ? layersViewableZoomOut.find(l => l.id === layer.id)
        : undefined;
    const matchingAndOriginallyHidden = matching && matching.original < mapScale;
    const shouldShowZoomOutToggle = layer.visible && !['wms', 'wmts', 'agfl'].includes(layer.type);
    const anyToggleViewable = layerViewable(layer, mapScale) || shouldShowZoomOutToggle;

    const getTitle = () => {
        if (matchingAndOriginallyHidden
            || (shouldShowZoomOutToggle && !layerViewable(layer, mapScale))) {
            return strings.mapLayerSettings.toggleVisibleZoomOut;
        } if (layer.minScale < mapScale && layer.minScale !== 0) {
            return strings.mapLayerSettings.zoomIn;
        } if (layer.maxScale > mapScale && layer.maxScale !== 0) {
            return strings.mapLayerSettings.zoomOut;
        }
        return strings.mapLayerSettings.toggleVisibility;
    };

    const getContent = () => {
        if (matchingAndOriginallyHidden || !layerViewable(layer, mapScale)) {
            return (
                <Fragment>
                    {(shouldShowZoomOutToggle && matching)
                        ? (
                            <div
                                className="symbolWrapper"
                                ref={(node) => {
                                    if (node) {
                                        const eyeNode: HTMLElement = document.createElement('i');
                                        eyeNode.className = 'fas fa-eye';
                                        node.innerHTML = '';
                                        node.appendChild(layer.legendSymbol.cloneNode(true));
                                        node.appendChild(eyeNode);
                                    }
                                }}
                            />
                        )
                        : <i className="fas fa-eye-slash" />}

                    {shouldShowZoomOutToggle && <MapLayerToggleIcon visible={matching} /> }
                </Fragment>
            );
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

    const onClick = () => {
        if (matching) {
            if (shouldShowZoomOutToggle) {
                if (matchingAndOriginallyHidden) {
                    toggleVisibleZoomOut(layer.id, layer.minScale);
                } else {
                    toggleLayer(layer.id);
                }
            } else if (!matchingAndOriginallyHidden) {
                toggleLayer(layer.id);
            }
        } else if (layerViewable(layer, mapScale)) {
            toggleLayer(layer.id);
        } else if (shouldShowZoomOutToggle) {
            toggleVisibleZoomOut(layer.id, layer.minScale);
        }
    };

    return (
        <Fragment>
            <LayerSettings.Toggle
                title={getTitle(layer, mapScale)}
                onClick={onClick}
                viewable={anyToggleViewable}
                childLayer={childLayer}
            >
                { getContent() }
            </LayerSettings.Toggle>
        </Fragment>
    );
};

export default MapLayerToggle;
