// @flow
import React, { Fragment } from 'react';
import LayerGroup from '../../../../ui/blocks/LayerGroup';

type Props = {
    layerGroups: Array<any>,
    handleGroupClick: (number) => void,
    activeGroup: number,
};

const MapLayersAllView = ({ layerGroups, handleGroupClick, activeGroup }: Props) => (
    <Fragment>
        {layerGroups.map(lg => (
            <LayerGroup key={lg.id} active={activeGroup === lg.id}>
                <LayerGroup.Header onClick={() => handleGroupClick(lg.id)}>
                    <div>
                        <span>{lg.name}</span>
                    </div>
                    <div>
                        <i className={activeGroup ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} />
                    </div>
                </LayerGroup.Header>
                <LayerGroup.Content hidden={activeGroup !== lg.id}>
                    {lg.layers.map(l => <p><input checked={l.visible} type="checkbox" />{l.name}</p>)}
                </LayerGroup.Content>
            </LayerGroup>
        ))}
    </Fragment>
);

export default MapLayersAllView;
