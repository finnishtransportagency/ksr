// @flow
import React, { Fragment } from 'react';
import LayerGroup from '../../../../ui/blocks/LayerGroup';
import MapLayerContainer from './map-layer/MapLayerContainer';
import Checkbox from '../../../../ui/blocks/Checkbox';
import SubLayerContainer from './sub-layer/SubLayerContrainer';

type Props = {
    layerGroups: Array<any>,
    layerList: any,
    handleGroupClick: (number) => void,
    handleSubGroupClick: (number) => void,
    handleLayerClick: (number) => Promise<void>,
    activeGroup: number,
    activeSubGroup: number,
    handleLayerGroupClick: (string) => Promise<void>,
    handleSubLayerGroupClick: (number) => Promise<void>,
    subLayers: Object[],
};

const divStyle = {
    outline: 'none',
};

const MapLayersAllView = ({
    layerGroups,
    layerList,
    handleGroupClick,
    handleSubGroupClick,
    handleLayerClick,
    activeGroup,
    activeSubGroup,
    handleLayerGroupClick,
    handleSubLayerGroupClick,
    subLayers,
}: Props) => (
    <Fragment>
        {layerGroups.map(lg => lg.layers.length > 0 && (
            <LayerGroup key={lg.id} active={activeGroup === lg.id}>
                <LayerGroup.Header onClick={() => handleGroupClick(lg.id)}>
                    <LayerGroup.Span>{lg.name}</LayerGroup.Span>
                    <Checkbox htmlFor={lg.name} layerAllView>
                        <Checkbox.Input
                            id={lg.name}
                            name={lg.name}
                            type="checkbox"
                            checked={layerList.filter(layer =>
                                layer.layerGroupName === lg.name &&
                                layer.relationType !== 'link').every(l => l.active)}
                            onChange={() => handleLayerGroupClick(lg.name)}
                        />
                        <Checkbox.Checkmark layerAllView />
                    </Checkbox>
                    <div
                        style={divStyle}
                        role="checkbox"
                        aria-checked="false"
                        aria-labelledby={lg.name}
                        tabIndex={lg.id}
                        onClick={() => handleGroupClick(lg.id)}
                        onKeyPress={() => handleGroupClick(lg.id)}
                    >
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
                    {lg.layers.filter(layer => layer.relationType !== 'link')
                        .sort((a, b) => b.layerOrder - a.layerOrder)
                        .map(l => (
                            layerList.find(layer => layer.id === l.id && !layer.parentLayer &&
                                !layerList.some(ll => ll.parentLayer === l.id))
                                ? <MapLayerContainer
                                    inputDisabled={l._source === 'shapefile'}
                                    key={l.id}
                                    layer={l}
                                    handleLayerClick={handleLayerClick}
                                    checked={layerList.find(layer => layer.id === l.id).active}
                                />
                                : <SubLayerContainer
                                    key={l.id}
                                    layer={l}
                                    handleLayerClick={handleLayerClick}
                                    subLayers={subLayers}
                                    activeSubGroup={activeSubGroup}
                                    handleSubGroupClick={handleSubGroupClick}
                                    handleSubLayerGroupClick={handleSubLayerGroupClick}
                                />
                        ))
                    }
                </LayerGroup.Content>
            </LayerGroup>
        ))}
    </Fragment>
);

export default MapLayersAllView;
