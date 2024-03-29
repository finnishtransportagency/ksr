/* eslint-disable react/require-default-props */
// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations';
import LayerSettings from '../../../../../ui/blocks/LayerSettings';
import MapLayerToggleIcon from './MapLayerToggleIcon';
import { layerViewable } from '../../../../../../utils/layers';
import Tooltip from '../../../../shared/Tooltip';

type Props = {
    layer: Object,
    mapScale: number,
    toggleLayer: (string) => void,
    childLayer: boolean,
    toggleVisibleZoomOut?: (string, number) => void,
    layersViewableZoomOut?: Object[],
};

function MapLayerToggle({
    layer, mapScale, toggleLayer, childLayer, toggleVisibleZoomOut, layersViewableZoomOut,
}: Props): React$Element<React$FragmentType> {
    const matching = layersViewableZoomOut !== undefined
        ? layersViewableZoomOut.find(l => l.id === layer.id)
        : undefined;
    const matchingAndOriginallyHidden = matching && matching.original < mapScale;
    const shouldShowZoomOutToggle = layer.visible && !['wms', 'wmts', 'agfl'].includes(layer.type);
    const anyToggleViewable = layerViewable(layer, mapScale) || shouldShowZoomOutToggle;
    const tooltipId = `active-layer-${layer.id}`;

    const getMultilayerNode = () => {
        const multiSymbolIcon: HTMLElement = document.createElement('i');
        multiSymbolIcon.className = 'fas fa-plus';
        multiSymbolIcon.style.fontSize = '0.7em';
        multiSymbolIcon.setAttribute('data-for', tooltipId);
        multiSymbolIcon.setAttribute('data-tip', 'tooltip');
        multiSymbolIcon.setAttribute('data-event', 'click');
        return multiSymbolIcon;
    };

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

    const getTooltip = () => layer.uniqueSymbols && layer.uniqueSymbols.length && (
        <Tooltip id={tooltipId}>
            {layer.uniqueSymbols.map((s) => (
                <div
                    style={{ display: 'flex' }}
                    key={`${tooltipId}-${s.label}`}
                    ref={(node) => {
                        if (node) {
                            node.innerHTML = '';
                            s.symbol.style = 'padding-right: 0.5em';
                            node.appendChild(s.symbol);
                            if (s.label) {
                                node.appendChild(
                                    document.createTextNode(s.label),
                                );
                            }
                        }
                    }}
                />
            ))}
        </Tooltip>
    );

    const getContent = () => {
        if (matchingAndOriginallyHidden || !layerViewable(layer, mapScale)) {
            return (
                <>
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

                    {shouldShowZoomOutToggle && <MapLayerToggleIcon visible={matching || false} /> }
                </>
            );
        } if (layer.legendSymbol) {
            return (
                <>
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
                </>
            );
        }
        return <MapLayerToggleIcon visible={layer.visible} />;
    };

    const onClick = () => {
        if (matching) {
            if (shouldShowZoomOutToggle) {
                if (matchingAndOriginallyHidden && toggleVisibleZoomOut) {
                    toggleVisibleZoomOut(layer.id, layer.minScale);
                } else {
                    toggleLayer(layer.id);
                }
            } else if (!matchingAndOriginallyHidden) {
                toggleLayer(layer.id);
            }
        } else if (layerViewable(layer, mapScale)) {
            toggleLayer(layer.id);
        } else if (shouldShowZoomOutToggle && toggleVisibleZoomOut) {
            toggleVisibleZoomOut(layer.id, layer.minScale);
        }
    };

    return (
        <>
            <LayerSettings.Toggle
                title={getTitle()}
                onClick={onClick}
                viewable={anyToggleViewable}
                childLayer={childLayer}
            >
                { getContent() }
            </LayerSettings.Toggle>
            {layerViewable(layer, mapScale) && layer.uniqueSymbols && layer.uniqueSymbols.length
                && (
                    [<LayerSettings.MultiSymbol
                        title={strings.mapLayerSettings.showMultiSymbol}
                        data-for={tooltipId}
                        data-tip="tooltip"
                        data-event="click"
                        ref={(node) => {
                            if (node) {
                                node.innerHTML = '';
                                node.appendChild(getMultilayerNode());
                            }
                        }}
                    />,
                    getTooltip()]
                )}
        </>
    );
}

export default MapLayerToggle;
