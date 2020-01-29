// @flow
import React, { Fragment } from 'react';
import Checkbox from '../../../../../ui/blocks/Checkbox';
import LayerGroup from '../../../../../ui/blocks/LayerGroup';
import LoadingIcon from '../../../../shared/LoadingIcon';
import { nestedVal } from '../../../../../../utils/nestedValue';

type Props = {
    layer: Object,
    handleLayerClick: (number) => void,
    layerList: any,
    subLayers: Object[],
    activeSubGroups: number[],
    handleSubGroupClick: (number) => void,
    handleSubLayerGroupClick: (number) => void,
    loadingLayers: string[],
    layersToFind: string,
    checkboxSquare: (layer: Object) => string,
};

const SubLayerView = ({
    layer,
    handleLayerClick,
    layerList,
    subLayers,
    activeSubGroups,
    handleSubGroupClick,
    handleSubLayerGroupClick,
    loadingLayers,
    layersToFind,
    checkboxSquare,
}: Props) => (
    <Fragment>
        {layer && !layer.parentLayer
        && (
            <LayerGroup.Header subLayer active={activeSubGroups.some(group => group === layer.id)}>
                <LayerGroup.Layer.Label subLayer htmlFor={layer.id} failOnLoad={layer.failOnLoad}>
                    {loadingLayers.some(ll => ll === layer.id) && <LoadingIcon size={6} loading />}
                    <input
                        onChange={() => handleLayerClick(layer.id)}
                        checked={nestedVal(layerList.find(l => l.id === layer.id), ['active'], false)}
                        type="checkbox"
                        value={layer.name}
                        id={layer.id}
                    />
                    <span>{layer.name}</span>
                </LayerGroup.Layer.Label>
                <Checkbox htmlFor={layer.name} layerAllView>
                    <Checkbox.Input
                        hidden
                        id={layer.name}
                        name={layer.name}
                        type="checkbox"
                        className={checkboxSquare(layer)}
                            layerList.find(l => l.id === layer.id)
                            && subLayers.filter(sl => sl.parentLayer === layer.id)
                                .some(sl => sl.active) ? 'checkboxSquare' : ''
                        }
                        checked={
                            nestedVal(layerList.find(l => l.id === layer.id), ['active'], false)
                            && subLayers.filter(sl => sl.parentLayer === layer.id
                            && !sl.failOnLoad
                            && sl.relationType !== 'link'
                            && (layersToFind
                                ? (sl.name.toLowerCase().includes(layersToFind)
                                    || layer.name.toLowerCase().includes(layersToFind)
                                    || layer.layerGroupName.toLowerCase().includes(layersToFind))
                                : true))
                                .every(sl => sl.active)
                        }
                        onChange={() => handleSubLayerGroupClick(layer.id)}
                    />
                    <Checkbox.Checkmark layerAllView />
                </Checkbox>
                <div
                    className="toggle-arrow"
                    role="checkbox"
                    aria-checked="false"
                    aria-labelledby={layer.name}
                    tabIndex={layer.id}
                    onClick={() => handleSubGroupClick(layer.id)}
                    onKeyPress={() => handleSubGroupClick(layer.id)}
                >
                    <i
                        className={
                            activeSubGroups.some(group => group === layer.id)
                                ? 'fas fa-chevron-up'
                                : 'fas fa-chevron-down'
                        }
                    />
                </div>
            </LayerGroup.Header>
        )
        }
        {layer && !layer.parentLayer && subLayers.sort((a, b) => b.layerOrder - a.layerOrder)
            .map(sub => ((sub.parentLayer === layer.id
                && (layersToFind
                    ? (sub.name.toLowerCase().includes(layersToFind)
                        || layer.name.toLowerCase().includes(layersToFind)
                        || layer.layerGroupName.toLowerCase().includes(layersToFind))
                    : true))
                ? (
                    <LayerGroup.Content
                        subLayer
                        hidden={!activeSubGroups.some(group => group === layer.id)}
                        key={sub.id}
                    >
                        {loadingLayers.some(ll => ll === sub.id)
                        && <LoadingIcon size={6} loading />}
                        <LayerGroup.Layer.Label htmlFor={sub.id} failOnLoad={sub.failOnLoad}>
                            <input
                                onChange={() => handleLayerClick(sub.id)}
                                checked={nestedVal(layerList.find(l => l.id === sub.id), ['active'], false)}
                                type="checkbox"
                                value={sub.name}
                                id={sub.id}
                            />
                            <span>{sub.name}</span>
                        </LayerGroup.Layer.Label>
                    </LayerGroup.Content>
                )
                : null))
        }
    </Fragment>
);

export default SubLayerView;
