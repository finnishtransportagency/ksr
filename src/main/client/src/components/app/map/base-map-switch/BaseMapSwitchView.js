// @flow
import React from 'react';
import { BaseMapButton, BaseMapContainer } from './styles';

type Props = {
    layers: Object[],
    tableOpen: boolean,
    sideBarOpen: boolean,
    adminToolActive: boolean,
    toggleLayer: (string) => void,
    activateLayers: (layers: Object[]) => void,
    loadingLayers: string[],
    tableButtonAmount: number,
};

function BaseMapSwitchView({
    layers,
    tableOpen,
    sideBarOpen,
    adminToolActive,
    toggleLayer,
    activateLayers,
    loadingLayers,
    tableButtonAmount,
}: Props): React$Element<any> {
    return (
        <BaseMapContainer
            hidden={layers.length === 0}
            tableOpen={tableOpen}
            sideBarOpen={sideBarOpen}
            adminToolActive={adminToolActive}
            tableButtonAmount={tableButtonAmount}
        >
            {layers.map(layer => (
                <BaseMapButton
                    title={layer.name}
                    key={layer.id}
                    disabled={loadingLayers.some(layerId => layerId === layer.id)}
                    flat={!layer.visible || !layer.active}
                    onClick={() => {
                        if (!layer.active) {
                            activateLayers([layer]);
                        } else {
                            toggleLayer(layer.id);
                        }
                    }}
                    onKeyPress={() => {
                        if (!layer.active) {
                            activateLayers([layer]);
                        } else {
                            toggleLayer(layer.id);
                        }
                    }}
                >
                    {layer.name}
                </BaseMapButton>
            ))}
        </BaseMapContainer>
    );
}

export default BaseMapSwitchView;
