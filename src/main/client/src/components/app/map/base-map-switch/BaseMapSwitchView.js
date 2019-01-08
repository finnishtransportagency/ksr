// @flow

import React from 'react';
import { BaseMapButton, BaseMapContainer } from './styles';

type Props = {
    layers: Object[],
    tableOpen: boolean,
    sideBarOpen: boolean,
    adminToolActive: boolean,
    toggleLayer: (string) => void,
};

const BaseMapSwitchView = ({
    layers,
    tableOpen,
    sideBarOpen,
    adminToolActive,
    toggleLayer,
}: Props) => (
    <BaseMapContainer
        hidden={layers.length === 0}
        tableOpen={tableOpen}
        sideBarOpen={sideBarOpen}
        adminToolActive={adminToolActive}
    >
        {layers.map(layer => (
            <BaseMapButton
                title={layer.name}
                key={layer.id}
                flat={!layer.visible || !layer.active}
                onClick={() => toggleLayer(layer.id)}
                onKeyPress={() => toggleLayer(layer.id)}
            >
                {layer.name}
            </BaseMapButton>
        ))}
    </BaseMapContainer>
);

export default BaseMapSwitchView;
