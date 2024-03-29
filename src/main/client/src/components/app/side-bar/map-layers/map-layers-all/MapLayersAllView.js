// @flow
import React, { Fragment } from 'react';
import LayerGroup from '../../../../ui/blocks/LayerGroup';
import MapLayerContainer from './map-layer/MapLayerContainer';
import Checkbox from '../../../../ui/blocks/Checkbox';
import LoadingIcon from '../../../shared/LoadingIcon';
import { nestedVal } from '../../../../../utils/nestedValue';
import strings from '../../../../../translations';
import { CheckboxWrapper, NoLayersFoundWrapper } from './styles';

type Props = {
    layerGroups: Array<any>,
    layerList: Object[],
    handleGroupClick: (number) => void,
    handleLayerClick: (number) => void,
    activeGroups: number[],
    handleLayerGroupClick: (string) => void,
    loadingLayers: string[],
    layersToFind: string,
};

function MapLayersAllView({
    layerGroups,
    layerList,
    handleGroupClick,
    handleLayerClick,
    activeGroups,
    handleLayerGroupClick,
    loadingLayers,
    layersToFind,
}: Props): React$Element<React$FragmentType> {
    return (
        <>
            {
                layerGroups.some(group => group.layers.length)
                    ? (
                        layerGroups.map(lg => lg.layers.length > 0 && (
                            <LayerGroup
                                key={lg.id}
                                active={activeGroups.some(group => group === lg.id)}
                            >
                                <LayerGroup.Header>
                                    <LayerGroup.Span
                                        onClick={() => handleGroupClick(lg.id)}
                                    >
                                        {lg.name}
                                    </LayerGroup.Span>
                                    <LayerGroup.Loading onClick={() => handleGroupClick(lg.id)}>
                                        <LoadingIcon
                                            size={8}
                                            loading={loadingLayers.some(ll => lg.layers.some(l => l.id
                                            === ll))}
                                        />
                                    </LayerGroup.Loading>
                                    <CheckboxWrapper>
                                        <Checkbox
                                            htmlFor={lg.name}
                                            layerAllView
                                            checkedSome={
                                                layerList.filter(layer => layer.layerGroupName
                                            === lg.name
                                            && !layer.failOnLoad
                                            && layer.relationType !== 'link'
                                            && (layersToFind
                                                ? (layer.layerGroupName.toLowerCase()
                                                    .includes(layersToFind)
                                                    || layer.name.toLowerCase()
                                                        .includes(layersToFind))
                                                : true))
                                                    .some(l => l.active)
                                            && !layerList.filter(layer => layer.layerGroupName
                                                === lg.name
                                                && !layer.parentLayer
                                                && !layer.failOnLoad
                                                && nestedVal(
                                                    layer.relations
                                                    && layer.relations.find(r => r),
                                                    ['relationType'],
                                                    '',
                                                ) !== 'link'
                                                && (layersToFind
                                                    ? (layer.layerGroupName.toLowerCase()
                                                        .includes(layersToFind)
                                                        || layer.name.toLowerCase()
                                                            .includes(layersToFind))
                                                    : true))
                                                .every(l => l.active)
                                            }
                                        >
                                            <Checkbox.Input
                                                hidden
                                                id={lg.name}
                                                name={lg.name}
                                                type="checkbox"
                                                checked={
                                                    layerList.filter(layer => layer.layerGroupName
                                                    === lg.name
                                                    && !layer.parentLayer
                                                    && !layer.failOnLoad
                                                    && nestedVal(
                                                        layer.relations
                                                        && layer.relations.find(r => r),
                                                        ['relationType'],
                                                        '',
                                                    ) !== 'link'
                                                    && (layersToFind
                                                        ? (layer.layerGroupName.toLowerCase()
                                                            .includes(layersToFind)
                                                            || layer.name.toLowerCase()
                                                                .includes(layersToFind))
                                                        : true)).length > 0
                                                && layerList.filter(layer => layer.layerGroupName
                                                    === lg.name
                                                    && !layer.parentLayer
                                                    && !layer.failOnLoad
                                                    && nestedVal(
                                                        layer.relations
                                                        && layer.relations.find(r => r),
                                                        ['relationType'],
                                                        '',
                                                    ) !== 'link'
                                                    && (layersToFind
                                                        ? (layer.layerGroupName.toLowerCase()
                                                            .includes(layersToFind)
                                                            || layer.name.toLowerCase()
                                                                .includes(layersToFind))
                                                        : true))
                                                    .every(l => l.active)
                                                }
                                                onChange={() => handleLayerGroupClick(lg.name)}
                                            />
                                            <Checkbox.Checkmark layerAllView />
                                        </Checkbox>
                                    </CheckboxWrapper>
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
                                                activeGroups.some(group => group === lg.id)
                                                    ? 'fas fa-chevron-up'
                                                    : 'fas fa-chevron-down'
                                            }
                                        />
                                    </div>
                                </LayerGroup.Header>
                                <LayerGroup.Content
                                    hidden={!activeGroups.some(group => group === lg.id)}
                                >
                                    {lg.layers.filter(layer => (nestedVal(
                                        layer.relations && layer.relations.find(r => r),
                                        ['relationType'],
                                        '',
                                    ) !== 'link'))
                                        .sort((a, b) => b.layerOrder - a.layerOrder)
                                        .map(l => (layerList.find(layer => layer.id === l.id
                                            && !layer.parentLayer)
                                        && (
                                            <MapLayerContainer
                                                inputDisabled={l._source === 'shapefile'}
                                                key={l.id}
                                                layer={l}
                                                layerGroupName={lg.name}
                                                handleLayerClick={handleLayerClick}
                                                checked={nestedVal(
                                                    layerList.find(layer => layer.id === l.id),
                                                    ['active'],
                                                    false,
                                                )}
                                            />
                                        )
                                        ))}
                                </LayerGroup.Content>
                            </LayerGroup>
                        ))
                    )
                    : <NoLayersFoundWrapper>{strings.mapLayers.noLayersFound}</NoLayersFoundWrapper>
            }
        </>
    );
}

export default MapLayersAllView;
