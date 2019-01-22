// @flow
import React, { Fragment } from 'react';
import Checkbox from '../../../../../ui/blocks/Checkbox';
import LayerGroup from '../../../../../ui/blocks/LayerGroup';

type Props = {
    layer: Object,
    handleLayerClick: (number) => void,
    layerList: any,
    subLayers: Object[],
    activeSubGroup: number,
    handleSubGroupClick: (number) => void,
    handleSubLayerGroupClick: (number) => void,
};

const divStyle = {
    outline: 'none',
};

const SubLayerView = ({
    layer,
    handleLayerClick,
    layerList,
    subLayers,
    activeSubGroup,
    handleSubGroupClick,
    handleSubLayerGroupClick,
}: Props) => (
    <Fragment>
        {!layer.parentLayer &&
            <LayerGroup.Header subLayer active={activeSubGroup === layer.id}>
                <LayerGroup.Layer.Label htmlFor={layer.id}>
                    <input
                        onChange={() => handleLayerClick(layer.id)}
                        checked={layerList.find(l => l.id === layer.id).active}
                        type="checkbox"
                        value={layer.name}
                        id={layer.id}
                    />
                    <span>{layer.name}</span>
                </LayerGroup.Layer.Label>
                <Checkbox htmlFor={layer.name} layerAllView>
                    <Checkbox.Input
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
                    style={divStyle}
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
