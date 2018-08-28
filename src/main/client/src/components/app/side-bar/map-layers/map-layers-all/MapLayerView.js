// @flow
import React from 'react';

import LayerGroup from '../../../../ui/blocks/LayerGroup';
import strings from '../../../../../translations';

type Props = {
    layer: Object,
    handleLayerClick: (number) => void,
    checked: boolean,
};

const MapLayerView = ({ layer, handleLayerClick, checked }: Props) => (
    <LayerGroup.Layer>
        <LayerGroup.Layer.Label htmlFor={layer.id}>
            <input
                onChange={() => handleLayerClick(layer.id)}
                checked={checked}
                type="checkbox"
                value={layer.name}
                id={layer.id}
            />
            <span>{layer.name}</span>
        </LayerGroup.Layer.Label>
        {
            !layer.userLayer ?
                null :
                (
                    <LayerGroup.Layer.RemoveIcon
                        data-balloon={strings.mapLayerView.removeTooltip}
                        data-balloon-pos="left"
                    >
                        <i className="fas fa-trash" />
                    </LayerGroup.Layer.RemoveIcon>
                )
        }
    </LayerGroup.Layer>
);

export default MapLayerView;
