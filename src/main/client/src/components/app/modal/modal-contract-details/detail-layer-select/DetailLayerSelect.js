// @flow
import React, { Fragment } from 'react';
import { Button } from '../../../../ui/elements';
import { nestedVal } from '../../../../../utils/nestedValue';

type Props = {
    detailLayers: Object[],
    detailList: Object[],
    setActiveView: (activeView: string) => void,
    setActiveDetailLayer: (layer: Object) => void,
    layerList: Object[],
};

const DetailLayerSelect = ({
    detailLayers,
    detailList,
    setActiveView,
    setActiveDetailLayer,
    layerList,
}: Props) => (
    <Fragment>
        {detailLayers.map(detailLayer => (
            <Button
                key={detailLayer.id}
                wide
                disabled={!nestedVal(
                    detailList.find(l => detailLayer.id === l.id),
                    ['createPermission'],
                )}
                onClick={() => {
                    setActiveView('addNewDetail');
                    setActiveDetailLayer(layerList
                        .find(l => l.id === detailLayer.id));
                }}
            >
                {detailLayer.name}
            </Button>
        ))}
    </Fragment>
);

export default DetailLayerSelect;
