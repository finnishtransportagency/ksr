// @flow
import React, { Fragment } from 'react';
import Checkbox from '../../../../../ui/blocks/Checkbox';
import LayerGroup from '../../../../../ui/blocks/LayerGroup';
import LoadingIcon from '../../../../shared/LoadingIcon';

type Props = {
    layer: Object,
    handleLayerClick: (number) => void,
    layerList: any,
    subLayers: Object[],
    activeSubGroup: number,
    handleSubGroupClick: (number) => void,
    handleSubLayerGroupClick: (number) => void,
    loadingLayers: string[],
};

const SubLayerView = ({
    layer,
    handleLayerClick,
    layerList,
    subLayers,
    activeSubGroup,
    handleSubGroupClick,
    handleSubLayerGroupClick,
    loadingLayers,
}: Props) => (
    <Fragment>
        {!layer.parentLayer &&
            <LayerGroup.Header subLayer active={activeSubGroup === layer.id}>
                <LayerGroup.Layer.Label subLayer htmlFor={layer.id}>
                    {loadingLayers.some(ll => ll === layer.id) && <LoadingIcon size={6} loading />}
                    <input
                        onChange={() => handleLayerClick(layer.id)}
                        checked={layerList.some(l => l.id === layer.id)
                        && layerList.find(l => l.id === layer.id).active}
                        type="checkbox"
                        value={layer.name}
                        id={layer.id}
                    />
                    <span>{layer.name}</span>
                </LayerGroup.Layer.Label>
                <Checkbox htmlFor={layer.name} layerAllView subLayer>
                    <Checkbox.Input
                        hidden
                        id={layer.name}
                        name={layer.name}
                        type="checkbox"
                        checked={subLayers.filter(sl =>
                            sl.parentLayer === layer.id &&
                            sl.relationType !== 'link').every(l => l.active)}
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
                            activeSubGroup === layer.id
                                ? 'fas fa-chevron-up'
                                : 'fas fa-chevron-down'
                        }
                    />
                </div>
            </LayerGroup.Header>
        }
        {!layer.parentLayer && subLayers.sort((a, b) => b.layerOrder - a.layerOrder)
            .map(sub => ((
                sub.parentLayer === layer.id)
                ?
                <LayerGroup.Content subLayer hidden={activeSubGroup !== layer.id} key={sub.id}>
                    {loadingLayers.some(ll => ll === sub.id) && <LoadingIcon size={6} loading />}
                    <LayerGroup.Layer.Label htmlFor={sub.id}>
                        <input
                            onChange={() => handleLayerClick(sub.id)}
                            checked={layerList.find(l => l.id === sub.id).active}
                            type="checkbox"
                            value={sub.name}
                            id={sub.id}
                        />
                        <span>{sub.name}</span>
                    </LayerGroup.Layer.Label>
                </LayerGroup.Content>
                : null))
        }
    </Fragment>
);

export default SubLayerView;
