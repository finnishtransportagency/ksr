// @flow
import React, { Fragment } from 'react';

import LayerGroup from '../../../../../ui/blocks/LayerGroup';
import strings from '../../../../../../translations';
import LoadingIcon from '../../../../shared/LoadingIcon';
import { nestedVal } from '../../../../../../utils/nestedValue';

type Props = {
    layer: Object,
    isUserlayer: boolean,
    handleLayerClick: (number) => void,
    removeUserLayer: Function,
    checked: boolean,
    inputDisabled: boolean,
    layerList: Object[],
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function,
    ) => void,
    loadingLayers: string[],
};

function MapLayerView({
    layer,
    isUserlayer,
    handleLayerClick,
    checked,
    removeUserLayer,
    inputDisabled,
    layerList,
    showConfirmModal,
    loadingLayers,
}: Props): React$Element<React$FragmentType> {
    return (
        <LayerGroup.Layer>
            {loadingLayers.some(ll => ll === layer.id) && <LoadingIcon size={6} loading />}
            <LayerGroup.Layer.Label
                htmlFor={layer.id}
                failOnLoad={nestedVal(layerList.find(l => l.id === layer.id), ['failOnLoad'])}
            >
                <input
                    disabled={inputDisabled || loadingLayers.some(ll => ll === layer.id)}
                    onChange={handleLayerClick}
                    checked={checked}
                    type="checkbox"
                    value={layer.name}
                    id={layer.id}
                />
                {
                    layer.type === 'agfl'
                && (
                    <>
                        <i className="fas fa-table" />
                        {' '}
                        <span>{layer.name}</span>
                    </>
                )
                }
                {
                    layer.type !== 'agfl' && <span>{layer.name}</span>
                }
            </LayerGroup.Layer.Label>
            {
                layer.userLayer && isUserlayer
                    ? (
                        <LayerGroup.Layer.RemoveIcon
                            data-balloon={strings.mapLayerView.removeTooltip}
                            data-balloon-pos="left"
                            onClick={() => {
                                if (!loadingLayers.some(ll => ll === layer.id)) {
                                    showConfirmModal(
                                        strings.modalRemoveUserLayer.content,
                                        strings.modalRemoveUserLayer.submit,
                                        strings.modalRemoveUserLayer.cancel,
                                        () => { removeUserLayer(layerList); },
                                    );
                                }
                            }}
                        >
                            <i className="fas fa-trash" />
                        </LayerGroup.Layer.RemoveIcon>
                    )
                    : null
            }
        </LayerGroup.Layer>
    );
}

export default MapLayerView;
