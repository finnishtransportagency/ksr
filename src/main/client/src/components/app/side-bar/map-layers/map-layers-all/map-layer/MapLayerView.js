// @flow
import React from 'react';

import LayerGroup from '../../../../../ui/blocks/LayerGroup';
import strings from '../../../../../../translations';

type Props = {
    layer: Object,
    handleLayerClick: (number) => void,
    removeUserLayer: Function,
    checked: boolean,
    inputDisabled: boolean,
    layerList: Object[],
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
};

const MapLayerView = ({
    layer,
    handleLayerClick,
    checked,
    removeUserLayer,
    inputDisabled,
    layerList,
    showConfirmModal,
}: Props) => (
    <LayerGroup.Layer>
        <LayerGroup.Layer.Label htmlFor={layer.id}>
            <input
                disabled={inputDisabled}
                onChange={handleLayerClick}
                checked={checked}
                type="checkbox"
                value={layer.name}
                id={layer.id}
            />
            {
                layer.type === 'agfl' &&
                <React.Fragment>
                    <i className="fas fa-table" />{' '}<span>{layer.name}</span>
                </React.Fragment>
            }
            {
                layer.type !== 'agfl' && <span>{layer.name}</span>
            }
        </LayerGroup.Layer.Label>
        {
            !layer.userLayer ?
                null :
                (
                    <LayerGroup.Layer.RemoveIcon
                        data-balloon={strings.mapLayerView.removeTooltip}
                        data-balloon-pos="left"
                        onClick={() => {
                            showConfirmModal(
                                strings.modalRemoveUserLayer.content,
                                strings.modalRemoveUserLayer.submit,
                                strings.modalRemoveUserLayer.cancel,
                                () => { removeUserLayer(layerList); },
                            );
                        }}
                    >
                        <i className="fas fa-trash" />
                    </LayerGroup.Layer.RemoveIcon>
                )
        }
    </LayerGroup.Layer>
);

export default MapLayerView;
