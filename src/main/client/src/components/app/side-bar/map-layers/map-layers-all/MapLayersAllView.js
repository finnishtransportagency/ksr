// @flow
import React, { Fragment } from 'react';
import LayerGroup from '../../../../ui/blocks/LayerGroup';

type Props = {
    layerGroups: Array<any>,
    layerList: Array<any>,
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
        {layerGroups.map(lg => (
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
                        <label key={l.id} htmlFor={l.name}>
                            <input
                                onChange={() => handleLayerClick(l.id)}
                                checked={layerList[layerList.findIndex(layer =>
                                    layer.id === l.id)].active}
                                type="checkbox"
                                value={l.name}
                                id={l.name}
                            />
                            <span>{l.name}</span>
                        </label>
                    ))}
                </LayerGroup.Content>
            </LayerGroup>
        ))}
    </Fragment>
);

export default MapLayersAllView;
