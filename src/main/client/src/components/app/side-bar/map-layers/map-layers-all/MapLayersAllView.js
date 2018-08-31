// @flow
import React, { Fragment } from 'react';
import LayerGroup from '../../../../ui/blocks/LayerGroup';

import MapLayerContainer from './map-layer/MapLayerContainer';

type Props = {
    layerGroups: Array<any>,
    layerList: any,
    handleGroupClick: (number) => void,
    handleLayerClick: (number) => void,
    activeGroup: number,
};

const MapLayersAllView = ({
    layerGroups,
    layerList,
    handleGroupClick,
    handleLayerClick,
    activeGroup,
}: Props) => (
    <Fragment>
        {layerGroups.map(lg => lg.layers.length > 0 && (
            <LayerGroup key={lg.id} active={activeGroup === lg.id}>
                <LayerGroup.Header onClick={() => handleGroupClick(lg.id)}>
                    <div>
                        <span>{lg.name}</span>
                    </div>
                    <div>
                        <i
                            className={
                                activeGroup === lg.id
                                    ? 'fas fa-chevron-up'
                                    : 'fas fa-chevron-down'
                            }
                        />
                    </div>
                </LayerGroup.Header>
                <LayerGroup.Content hidden={activeGroup !== lg.id}>
                    {lg.layers.map(l => (
                        layerList.find(layer => layer.id === l.id)
                            ? <MapLayerContainer
                                key={l.id}
                                layer={l}
                                handleLayerClick={handleLayerClick}
                                checked={layerList.find(layer => layer.id === l.id).active}
                            />
                            : null
                    ))
                    }
                </LayerGroup.Content>
            </LayerGroup>
        ))}
    </Fragment>
);

export default MapLayersAllView;
