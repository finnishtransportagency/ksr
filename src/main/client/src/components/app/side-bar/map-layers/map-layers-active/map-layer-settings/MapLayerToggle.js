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

    const addSymbolsToNode = (node: HTMLDivElement) => {
        node.innerHTML = '';
        if (layer.uniqueSymbols) {
            const wrapper: HTMLElement = document.createElement('div');
            wrapper.style = 'display: flex';
            wrapper.appendChild(
                layer.legendSymbol.cloneNode(true),
            );

            const multiSymbolIcon: HTMLElement = document.createElement('i');
            multiSymbolIcon.className = 'fas fa-plus';
            multiSymbolIcon.style = 'font-size: 0.5em';
            wrapper.appendChild(multiSymbolIcon);
            node.appendChild(wrapper);
        } else {
            node.appendChild(
                layer.legendSymbol.cloneNode(true),
            );
        }
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

    const getContent = () => {
        const tooltipId = `active-layer-${layer.id}`;
        if (matchingAndOriginallyHidden || !layerViewable(layer, mapScale)) {
            return (
                <Fragment>
                    {(shouldShowZoomOutToggle && matching)
                        ? (
                            <Fragment>
                                <div
                                    className="symbolWrapper"
                                    data-for={tooltipId}
                                    data-tip="tooltip"
                                    ref={(node) => {
                                        if (node) {
                                            addSymbolsToNode(node);
                                        }
                                    }}
                                />
                                {layer.uniqueSymbols && layer.uniqueSymbols.length && (
                                    <Tooltip
                                        id={tooltipId}
                                    >
                                        {layer.uniqueSymbols.map(s => (
                                            <div
                                                style={{ display: 'flex' }}
                                                ref={(node) => {
                                                    if (node) {
                                                        node.innerHTML = '';
                                                        s.symbol.style = 'padding-right: 0.5em';
                                                        node.appendChild(s.symbol);
                                                        node.appendChild(
                                                            document.createTextNode(s.label),
                                                        );
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Tooltip>
                                )}
                            </Fragment>
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
                        data-for={tooltipId}
                        data-tip="tooltip"
                        ref={(node) => {
                            if (node) {
                                addSymbolsToNode(node);
                            }
                        }}
                    />
                    {layer.uniqueSymbols && layer.uniqueSymbols.length && (
                        <Tooltip
                            id={tooltipId}
                        >
                            {layer.uniqueSymbols.map(s => (
                                <div
                                    style={{ display: 'flex' }}
                                    ref={(node) => {
                                        if (node) {
                                            node.innerHTML = '';
                                            s.symbol.style = 'padding-right: 0.5em';
                                            node.appendChild(s.symbol);
                                            node.appendChild(document.createTextNode(s.label));
                                        }
                                    }}
                                />
                            ))}
                        </Tooltip>
                    )}
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
