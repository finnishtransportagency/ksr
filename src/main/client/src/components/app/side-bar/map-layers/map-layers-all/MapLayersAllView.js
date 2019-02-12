// @flow
import React, { Fragment } from 'react';
import LayerGroup from '../../../../ui/blocks/LayerGroup';
import MapLayerContainer from './map-layer/MapLayerContainer';
import Checkbox from '../../../../ui/blocks/Checkbox';
import SubLayerContainer from './sub-layer/SubLayerContainer';
import LoadingIcon from '../../../shared/LoadingIcon';
import { nestedVal } from '../../../../../utils/nestedValue';

type Props = {
    layerGroups: Array<any>,
    layerList: Object[],
    handleGroupClick: (number) => void,
    handleSubGroupClick: (number) => void,
    handleLayerClick: (number) => void,
    activeGroup: number,
    activeSubGroup: number,
    handleLayerGroupClick: (string) => void,
    handleSubLayerGroupClick: (number) => void,
    loadingLayers: string[],
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
    loadingLayers,
}: Props) => (
    <Fragment>
        {layerGroups.map(lg => lg.layers.length > 0 && (
            <LayerGroup key={lg.id} active={activeGroup === lg.id}>
                <LayerGroup.Header >
                    <LayerGroup.Span
                        onClick={() => handleGroupClick(lg.id)}
                    >
                        {lg.name}
                    </LayerGroup.Span>
                    <LayerGroup.Loading onClick={() => handleGroupClick(lg.id)}>
                        <LoadingIcon
                            size={8}
                            loading={loadingLayers.some(ll =>
                                lg.layers.some(l => l.id === ll))}
                        />
                    </LayerGroup.Loading>
                    <Checkbox htmlFor={lg.name} layerAllView>
                        <Checkbox.Input
                            hidden
                            id={lg.name}
                            name={lg.name}
                            type="checkbox"
                            checked={layerList.filter(layer =>
                                layer.layerGroupName === lg.name &&
                                !layer.parentLayer &&
                                !layer.failOnLoad &&
                                layer.relationType !== 'link').length > 0 &&
                            layerList.filter(layer =>
                                layer.layerGroupName === lg.name &&
                                !layer.parentLayer &&
                                !layer.failOnLoad &&
                                layer.relationType !== 'link').every(l => l.active)}
                            onChange={() => handleLayerGroupClick(lg.name)}
                        />
                        <Checkbox.Checkmark layerAllView />
                    </Checkbox>
                    <div
                        className="arrow-wrapper"
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
                                    checked={nestedVal(layerList.find(layer => layer.id === l.id), ['active'])}
                                />
                                : <SubLayerContainer
                                    key={l.id}
                                    layer={l}
                                    handleLayerClick={handleLayerClick}
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
