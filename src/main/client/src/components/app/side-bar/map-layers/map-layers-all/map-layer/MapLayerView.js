// @flow
import React from 'react';

import LayerGroup from '../../../../../ui/blocks/LayerGroup';
import strings from '../../../../../../translations';

type Props = {
    layer: Object,
    handleLayerClick: (number) => void,
    removeUserLayer: Function,
    checked: boolean,
};

const MapLayerView = ({
    layer,
    handleLayerClick,
    checked,
    removeUserLayer,
}: Props) => (
    <LayerGroup.Layer>
        <LayerGroup.Layer.Label htmlFor={layer.id}>
            <input
                onChange={handleLayerClick}
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
                        onClick={removeUserLayer}
                    >
                        <i className="fas fa-trash" />
                    </LayerGroup.Layer.RemoveIcon>
                )
        }
    </LayerGroup.Layer>
);

export default MapLayerView;
