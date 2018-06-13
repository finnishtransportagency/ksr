// @flow
import React, { Component } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import LoadingIcon from '../../../shared/LoadingIcon';
import MapLayersActiveView from './MapLayersActiveView';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

type Props = {
    layerGroups: {
        layerGroups: Array<any>,
        layerList: Array<any>,
        fetching: boolean,
    },
    setLayerList: (Array<any>) => void,
};

type State = {
    /* ... */
};

class MapLayersActive extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd = (result: DropResult) => {
        const { layerGroups, setLayerList } = this.props;

        if (!result.destination) {
            return;
        }

        const layerList = reorder(
            layerGroups.layerList,
            result.source.index,
            result.destination.index,
        );

        setLayerList(layerList);
    };

    render() {
        const { layerList, fetching } = this.props.layerGroups;

        if (!fetching) {
            return (
                <MapLayersActiveView
                    activeLayers={layerList}
                    onDragEnd={this.onDragEnd}
                />
            );
        }

        return <LoadingIcon loading={fetching} />;
    }
}

export default MapLayersActive;
