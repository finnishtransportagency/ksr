// @flow
import React, { Fragment } from 'react';
import { Button } from '../../../../ui/elements';

type Props = {
    detailLayers: Object[],
    setActiveView: (activeView: string) => void,
    setActiveDetailLayer: (layer: Object) => void,
    layerList: Object[],
};

const DetailLayerSelect = ({
    detailLayers,
    setActiveView,
    setActiveDetailLayer,
    layerList,
}: Props) => (
    <Fragment>
        {detailLayers.map(detailLayer => (
            <Button
                key={detailLayer.id}
                wide
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
